import { nullthrows, upcaseAt } from '@strut/utils';
import { CodegenStep } from '@aphro/codegen-api';
import TypescriptFile from './TypescriptFile.js';
import { nodeFn, edgeFn, tsImport } from '@aphro/schema';
import { importsToString } from './tsUtils.js';
export default class GenTypescriptQuery extends CodegenStep {
    schema;
    // This can technicall take a node _or_ an edge.
    // also... should we have access to the entire schema file?
    static accepts(_schema) {
        return true;
    }
    constructor(schema) {
        super();
        this.schema = schema;
    }
    // Nit:
    // we can technically return an array of files.
    // Since we can have edge data... so we'd need edge queries rather than a query per schema.
    // b/c structure on the edges...
    // TODO: de-duplicate imports by storing imports in an intermediate structure.
    gen() {
        const imports = this.collectImports();
        return new TypescriptFile(nodeFn.queryTypeName(this.schema.name) + '.ts', `${importsToString(imports)}

export default class ${nodeFn.queryTypeName(this.schema.name)} extends DerivedQuery<${this.schema.name}> {
  static create() {
    return new ${nodeFn.queryTypeName(this.schema.name)}(
      QueryFactory.createSourceQueryFor(spec),
      modelLoad(spec.createFrom),
    );
  }
  ${this.getFromIdMethodCode()}
  ${this.getFromInboundFieldEdgeMethodsCode()}

  ${this.getFilterMethodsCode()}
  ${this.getHopMethodsCode()}
}
`);
    }
    collectImports() {
        return [
            ...[
                'DerivedQuery',
                'QueryFactory',
                'modelLoad',
                'filter',
                'Predicate',
                'P',
                'ModelFieldGetter',
            ].map(i => tsImport(`{${i}}`, null, '@aphro/query-runtime-ts')),
            tsImport('{SID_of}', null, '@strut/sid'),
            tsImport(this.schema.name, null, `./${this.schema.name}.js`),
            tsImport('{Data}', null, `./${this.schema.name}.js`),
            tsImport('{spec}', null, `./${this.schema.name}.js`),
            ...this.getIdFieldImports(),
            ...this.getEdgeImports(),
        ];
    }
    getFilterMethodsCode() {
        const ret = [];
        const fields = Object.values(this.schema.fields);
        for (const field of fields) {
            ret.push(`
      where${upcaseAt(field.name, 0)}(p: Predicate<Data["${field.name}"]>) {
        ${this.getFilterMethodBody(field)}
      }`);
        }
        return ret.join('\n');
    }
    getFilterMethodBody(field) {
        return `return new ${nodeFn.queryTypeName(this.schema.name)}(
      this,
      filter(
        new ModelFieldGetter<"${field.name}", Data, ${this.schema.name}>("${field.name}"),
        p,
      ), 
    )`;
    }
    getFromIdMethodCode() {
        return `
static fromId(id: SID_of<${this.schema.name}>) {
  return this.create().whereId(P.equals(id));
}
`;
    }
    getFromInboundFieldEdgeMethodsCode() {
        // this would be inbound edges, right?
        // inbound edges to me based on one of my fields.
        const inbound = Object.values(this.schema.extensions.inboundEdges?.edges || {})
            .filter(edge => edge.type === 'edge')
            .filter((edge) => edgeFn.isThroughNode(this.schema, edge));
        return inbound.map(this.getFromInboundFieldEdgeMethodCode).join('\n');
    }
    getFromInboundFieldEdgeMethodCode(edge) {
        const column = nullthrows(edge.throughOrTo.column);
        const field = this.schema.fields[column];
        if (field.type !== 'id') {
            throw new Error('fields edges must refer to id fields');
        }
        return `
static from${upcaseAt(column, 0)}(id: SID_of<${field.of}>) {
  return this.create().where${upcaseAt(field.name, 0)}(P.equals(id));
}
`;
    }
    getEdgeImports() {
        const inbound = Object.values(this.schema.extensions.inboundEdges?.edges || {}).filter(e => e.type === 'edge');
        const outbound = Object.values(this.schema.extensions.outboundEdges?.edges || {}).filter(e => e.type === 'edge');
        return [...inbound, ...outbound]
            .filter(edge => edgeFn.queryTypeName(this.schema, edge) !== nodeFn.queryTypeName(this.schema.name))
            .flatMap(edge => [
            tsImport('{spec}', `${edgeFn.destModelTypeName(this.schema, edge)}Spec`, `./${edgeFn.destModelTypeName(this.schema, edge)}`),
            tsImport(edgeFn.queryTypeName(this.schema, edge), null, `./${edgeFn.queryTypeName(this.schema, edge)}`),
        ]);
        // import edge reference queries too
    }
    getIdFieldImports() {
        // TODO: fix all these cases on filter(s)
        const idFields = Object.values(this.schema.fields).filter(f => f.type === 'id');
        return idFields.map(f => tsImport(f.of, null, './' + f.of + '.js'));
    }
    getHopMethodsCode() {
        // hop methods are edges
        // e.g., Deck.querySlides().queryComponents()
        const outbound = Object.values(this.schema.extensions.outboundEdges?.edges || {});
        return outbound.map(e => this.getHopMethod(e)).join('\n');
    }
    getHopMethod(edge) {
        if (edge.type === 'edgeReference') {
            throw new Error('Edge references not yet supported...');
        }
        let body = '';
        if (edgeFn.isTo(edge)) {
            body = this.getHopMethodForJunctionLikeEdge(edge);
        }
        else {
            body = this.getHopMethodForFieldLikeEdge(edge);
        }
        return `query${upcaseAt(edge.name, 0)}(): ${edgeFn.queryTypeName(this.schema, edge)} {
      ${body}
    }`;
    }
    getHopMethodForJunctionLikeEdge(edge) {
        return '';
    }
    getHopMethodForFieldLikeEdge(edge) {
        let hopOperation = '';
        // are we through a field on our own type?
        if (edgeFn.isThroughNode(this.schema, edge)) {
            hopOperation = `whereId(P.equals(this.${edge.throughOrTo.column}))`;
        }
        else {
            // we are through a field on the dest node.
            hopOperation = `where${upcaseAt(nullthrows(edge.throughOrTo.column), 0)}(P.equals(this.id))`;
        }
        return `return new ${edgeFn.queryTypeName(this.schema, edge)}(QueryFactory.createHopQueryFor(this, spec, ${edgeFn.destModelTypeName(this.schema, edge)}Spec),
      modelLoad(${edgeFn.destModelTypeName(this.schema, edge)}Spec.createFrom),
      ).${hopOperation};`;
    }
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
//# sourceMappingURL=GenTypescriptQuery.js.map