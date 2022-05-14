import { asPropertyAccessor, upcaseAt } from '@strut/utils';
import { fieldToTsType, importsToString } from './tsUtils.js';
import { CodegenFile, CodegenStep } from '@aphro/codegen-api';
import TypescriptFile from './TypescriptFile.js';
import { EdgeDeclaration, EdgeReferenceDeclaration, ID, Import, Node } from '@aphro/schema-api';
import { nodeFn, edgeFn, tsImport } from '@aphro/schema';

export default class GenTypescriptModel extends CodegenStep {
  static accepts(_schema: Node): boolean {
    return true;
  }

  constructor(private schema: Node) {
    super();
  }

  gen(): CodegenFile {
    return new TypescriptFile(
      this.schema.name + '.ts',
      `${importsToString(this.collectImports())}

export type Data = ${this.getDataShapeCode()};

${this.schema.extensions.type?.decorators?.join('\n') || ''}
export default class ${this.schema.name}
  extends Model<Data> {
  readonly spec = s as ModelSpec<this, Data>;

  ${this.getFieldCode()}
  ${this.getEdgeCode()}
}
`,
    );
  }

  private getDataShapeCode(): string {
    const fieldProps = Object.values(this.schema.fields).map(
      field => `${asPropertyAccessor(field.name)}: ${fieldToTsType(field)}`,
    );
    return `{
  ${fieldProps.join(',\n')}
}`;
  }

  private collectImports(): Import[] {
    return [
      tsImport('{default}', 's', './' + nodeFn.specName(this.schema.name) + '.js'),
      tsImport('{P}', null, '@aphro/query-runtime-ts'),
      tsImport('{Model}', null, '@aphro/model-runtime-ts'),
      tsImport('{ModelSpec}', null, '@aphro/model-runtime-ts'),
      tsImport('{SID_of}', null, '@strut/sid'),
      ...(this.schema.extensions.module?.imports.values() || []),
      ...this.getEdgeImports(),
      ...this.getIdFieldImports(),
    ].filter(i => i.name !== this.schema.name);
  }

  private getIdFieldImports(): Import[] {
    const idFields = Object.values(this.schema.fields).filter(f => f.type === 'id') as ID[];

    return idFields.map(f => tsImport(f.of, null, './' + f.of + '.js'));
  }

  private getEdgeImports(): Import[] {
    const ret: Import[] = [];
    for (const edge of nodeFn.allEdges(this.schema)) {
      ret.push(
        tsImport(
          edgeFn.queryTypeName(this.schema, edge),
          null,
          './' + edgeFn.queryTypeName(this.schema, edge) + '.js',
        ),
      );
      if (edge.type === 'edge') {
        if (edge.throughOrTo.type !== this.schema.name) {
          ret.push(tsImport(edge.throughOrTo.type, null, './' + edge.throughOrTo.type + '.js'));
        }
      }
    }

    return ret;
  }

  private getFieldCode(): string {
    return Object.values(this.schema.fields)
      .map(field => {
        if (field.name === 'id') {
          return `${field.decorators?.join('\n') || ''}
            get ${field.name}(): SID_of<this> {
              return this.data.${field.name} as SID_of<this>;
            }
          `;
        }
        return `${field.decorators?.join('\n') || ''}
          get ${field.name}(): ${fieldToTsType(field)} {
            return this.data.${field.name};
          }
        `;
      })
      .join('\n');
  }

  private getEdgeCode(): string {
    /*
    outbound edges
    - through a field on self: field edge
    - to self type: should have been a junction edge?
      - not yet supported, ask user to declare a standalone junction
      - could be an edge stored in a different system or a junction edge.
    - through a field on other: foreign key edge
    - to a other type: should have been a junction edge?
      - not yet supported, ask user to declare a standalone edge
      - could be an edge stored in a different system or a junction edge.

    inbound edges:
    - through a field on self
      - foreign key
    - through a field on other
      - foreign key
    - from self
      - see outbound `to self type`
    - from other type
      - see outbound `to other type`
    */

    return Object.values(this.schema.extensions.outboundEdges?.edges || {})
      .map(
        edge => `query${upcaseAt(edge.name, 0)}(): ${edgeFn.queryTypeName(this.schema, edge)} {
          return ${edgeFn.queryTypeName(this.schema, edge)}.${this.getFromMethodInvocation(
          'outbound',
          edge,
        )};
        }`,
      )
      .join('\n');

    // TODO: static inbound edge defs
  }

  // inbound edges would be static methods
  private getFromMethodInvocation(
    type: 'inbound' | 'outbound',
    edge: EdgeDeclaration | EdgeReferenceDeclaration,
  ): string {
    if (type === 'inbound') {
      throw new Error('inbound edge generation on models not yet supported');
    }

    // outbound edge through a field would be:
    // outbound foreign key would be: BarQuery.fromFooId(this.id); // Foo | OB { Edge<Bar.fooId> }
    // outbound field edge would be: BarQuery.fromId(this.barId); // Foo | OB { Edge<Foo.barId> }

    switch (edge.type) {
      case 'edge':
        const column = edge.throughOrTo.column;
        if (column == null) {
          // this error should already have been thrown earlier.
          throw new Error(
            'Locally declared edge that is not _through_ something is currently unsupported',
          );
        }

        // through a field on self is a field edge
        // a field edge refers to the id of the destination type.
        if (edge.throughOrTo.type === this.schema.name) {
          return `fromId(this.ctx, this.${column})`;
        }

        // through a field on some other type is a foreign key edge
        // we're thus qurying that type based on some column rather than its id
        return `create(this.ctx).where${upcaseAt(column, 0)}(P.equals(this.id))`;
      case 'edgeReference':
        // if (edge.inverted) {
        //   return "fromDst";
        // }
        return 'fromSrc(this.ctx, this.id)';
    }
  }
}
