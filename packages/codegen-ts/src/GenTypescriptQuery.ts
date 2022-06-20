import { nullthrows, upcaseAt } from '@strut/utils';
import { CodegenFile, CodegenStep } from '@aphro/codegen-api';
import TypescriptFile from './TypescriptFile.js';
import {
  Field,
  Node,
  EdgeDeclaration,
  EdgeReferenceDeclaration,
  ID,
  Import,
  Edge,
} from '@aphro/schema-api';
import { nodeFn, edgeFn, tsImport } from '@aphro/schema';
import { importsToString } from './tsUtils.js';

export default class GenTypescriptQuery extends CodegenStep {
  // This can technicall take a node _or_ an edge.
  // also... should we have access to the entire schema file?
  static accepts(schema: Node | Edge): boolean {
    return schema.type === 'node';
  }

  private schema: Node;
  private edges: { [key: string]: Edge };

  constructor(opts: { nodeOrEdge: Node; edges: { [key: string]: Edge }; dest: string }) {
    super();
    this.schema = opts.nodeOrEdge;
    this.edges = opts.edges;
  }

  // Nit:
  // we can technically return an array of files.
  // Since we can have edge data... so we'd need edge queries rather than a query per schema.
  // b/c structure on the edges...
  // TODO: de-duplicate imports by storing imports in an intermediate structure.
  async gen(): Promise<CodegenFile> {
    const imports = this.collectImports();
    return new TypescriptFile(
      nodeFn.queryTypeName(this.schema.name) + '.ts',
      `${importsToString(imports)}

export default class ${nodeFn.queryTypeName(this.schema.name)} extends DerivedQuery<${
        this.schema.name
      }> {
  static create(ctx: Context) {
    return new ${nodeFn.queryTypeName(this.schema.name)}(
      ctx,
      QueryFactory.createSourceQueryFor(ctx, spec),
      modelLoad(ctx, spec.createFrom),
    );
  }

  static empty(ctx: Context) {
    return new ${nodeFn.queryTypeName(this.schema.name)}(
      ctx,
      new EmptyQuery(ctx),
    );
  }

  protected derive(expression: Expression): ${nodeFn.queryTypeName(this.schema.name)} {
    return new ${nodeFn.queryTypeName(this.schema.name)}(
      this.ctx,
      this,
      expression,
    )
  }

  ${this.getFromIdMethodCode()}
  ${this.getFromInboundFieldEdgeMethodsCode()}

  ${this.getFilterMethodsCode()}
  ${this.getHopMethodsCode()}

  ${this.getTakeMethodCode()}
  ${this.getOrderByMethodsCode()}

  ${this.getProjectionMethodsCode()}
}
`,
    );
  }

  private collectImports(): Import[] {
    return [
      tsImport('{Context}', null, '@aphro/runtime-ts'),
      ...[
        'DerivedQuery',
        'QueryFactory',
        'modelLoad',
        'filter',
        'Predicate',
        'take',
        'orderBy',
        'P',
        'ModelFieldGetter',
        'Expression',
        'EmptyQuery',
      ].map(i => tsImport(`{${i}}`, null, '@aphro/runtime-ts')),
      tsImport('{SID_of}', null, '@aphro/runtime-ts'),
      tsImport(this.schema.name, null, `./${this.schema.name}.js`),
      tsImport('{Data}', null, `./${this.schema.name}.js`),
      tsImport('{default}', 'spec', `./${nodeFn.specName(this.schema.name)}.js`),
      ...this.getIdFieldImports(),
      ...this.getEdgeImports(),
    ];
  }

  private getFilterMethodsCode(): string {
    const ret: string[] = [];
    const fields = Object.values(this.schema.fields);
    for (const field of fields) {
      ret.push(`
      where${upcaseAt(field.name, 0)}(p: Predicate<Data["${field.name}"]>) {
        ${this.getFilterMethodBody(field)}
      }`);
    }
    return ret.join('\n');
  }

  private getFilterMethodBody(field: Field): string {
    return `return this.derive(
      filter(
        new ModelFieldGetter<"${field.name}", Data, ${this.schema.name}>("${field.name}"),
        p,
      ), 
    )`;
  }

  private getOrderByMethodsCode(): string {
    const ret: string[] = [];
    const fields = Object.values(this.schema.fields);
    for (const field of fields) {
      ret.push(`
      orderBy${upcaseAt(field.name, 0)}(direction: 'asc' | 'desc' = 'asc') {
        ${this.getOrderByMethodBody(field)}
      }`);
    }
    return ret.join('\n');
  }

  private getOrderByMethodBody(field: Field): string {
    return `return this.derive(
      orderBy(
        new ModelFieldGetter<"${field.name}", Data, ${this.schema.name}>("${field.name}"),
        direction,
      ), 
    )`;
  }

  private getFromIdMethodCode(): string {
    return `
static fromId(ctx: Context, id: SID_of<${this.schema.name}>) {
  return this.create(ctx).whereId(P.equals(id));
}
`;
  }

  private getFromInboundFieldEdgeMethodsCode(): string {
    // this would be inbound edges, right?
    // inbound edges to me based on one of my fields.
    const inbound: EdgeDeclaration[] = Object.values(
      this.schema.extensions.inboundEdges?.edges || {},
    )
      .filter(edge => edge.type === 'edge')
      .filter((edge: EdgeDeclaration) =>
        edgeFn.isThroughNode(this.schema, edge),
      ) as EdgeDeclaration[];

    return inbound.map(this.getFromInboundFieldEdgeMethodCode).join('\n');
  }

  private getFromInboundFieldEdgeMethodCode(edge: EdgeDeclaration): string {
    const column = nullthrows(edge.throughOrTo.column);
    const field = this.schema.fields[column];

    if (field.type !== 'id') {
      throw new Error('fields edges must refer to id fields');
    }

    return `
static from${upcaseAt(column, 0)}(ctx: Context, id: SID_of<${field.of}>) {
  return this.create(ctx).where${upcaseAt(field.name, 0)}(P.equals(id));
}
`;
  }

  private getEdgeImports(): Import[] {
    const inbound = Object.values(this.schema.extensions.inboundEdges?.edges || {}).filter(
      e => e.type === 'edge',
    ) as EdgeDeclaration[];

    const outbound = Object.values(this.schema.extensions.outboundEdges?.edges || {}).filter(
      e => e.type === 'edge',
    ) as EdgeDeclaration[];

    return [...inbound, ...outbound]
      .filter(
        edge => edgeFn.queryTypeName(this.schema, edge) !== nodeFn.queryTypeName(this.schema.name),
      )
      .flatMap(edge => [
        tsImport(
          '{default}',
          `${edgeFn.destModelSpecName(this.schema, edge)}`,
          `./${edgeFn.destModelSpecName(this.schema, edge)}.js`,
        ),
        tsImport(
          edgeFn.queryTypeName(this.schema, edge),
          null,
          `./${edgeFn.queryTypeName(this.schema, edge)}.js`,
        ),
      ]);

    // import edge reference queries too
  }

  private getIdFieldImports(): Import[] {
    // TODO: fix all these cases on filter(s)
    const idFields = Object.values(this.schema.fields).filter(f => f.type === 'id') as ID[];

    return idFields.map(f => tsImport(f.of, null, './' + f.of + '.js'));
  }

  private getHopMethodsCode(): string {
    // hop methods are edges
    // e.g., Deck.querySlides().queryComponents()
    const outbound = Object.values(this.schema.extensions.outboundEdges?.edges || {});
    return outbound.map(e => this.getHopMethod(e)).join('\n');
  }

  private getHopMethod(edge: EdgeDeclaration | EdgeReferenceDeclaration): string {
    const e = edgeFn.dereference(edge, this.edges);

    // if (edgeFn.isTo(edge)) {
    //   body = this.getHopMethodForJunctionLikeEdge(edge);
    // }

    return `query${upcaseAt(edge.name, 0)}(): ${edgeFn.queryTypeName(this.schema, e)} {
      ${this.getHopMethodBody(e)}
    }`;
  }

  private getHopMethodForJunctionLikeEdge(edge: EdgeDeclaration | Edge): string {
    return '';
  }

  private getHopMethodBody(edge: EdgeDeclaration | Edge): string {
    return `return new ${edgeFn.queryTypeName(
      this.schema,
      edge,
    )}(this.ctx, QueryFactory.createHopQueryFor(this.ctx, this, spec.outboundEdges.${edge.name}),
      modelLoad(this.ctx, ${edgeFn.destModelTypeName(this.schema, edge)}Spec.createFrom),
    );`;
  }

  private getTakeMethodCode(): string {
    return `take(n: number) {
      return new ${nodeFn.queryTypeName(this.schema.name)}(
        this.ctx,
        this,
        take(n),
      );
    }`;
  }

  private getProjectionMethodsCode(): string {
    return '';
  }

  /*
  return new ComponentQuery(
    QueryFactory.createHopQueryFor(this, spec, ComponentSpec, edgeDef??),
    modelLoad(ComponentSpec.createFrom),
  ) // --> rm this as edge def does it: .whereSlideId(P.equals(this.id));

  createHopQuery should take in:
  - source spec & field for join
  - dest spec & field for join

  Now if it is neo... we'll figure something out.
  Maybe it is just src, dest, edge name?
  */
}

/*
Codegening the query shouldn't care what the underlying storage impl is.
Query layer is storage agnostic.

Thus we should use the `schema` to call into a `factory` which will construct the
`source query` / `source expression` based on the underlying storage type.
*/

/*
Derived query example:
SlideQuery extends DerivedQuery {
  static create() {
    return new SlideQuery(
      Factory.createSourceQueryFor(schema) // e.g., new SQLSourceQuery(schema),
      // convert raw db result into model load.
      // we'd want to move this expression to the end in plan optimizaiton.
      new ModelLoadExpression(Slide.createFromData)
    );
  }

  whereName(predicate: Predicate) {
    return new SlideQuery(
      this, // the prior query
      new ModelFilterExpression(field, predicate)
    );
  }
}
*/
