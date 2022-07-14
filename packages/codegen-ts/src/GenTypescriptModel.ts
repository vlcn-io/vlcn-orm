import { asPropertyAccessor, upcaseAt } from '@strut/utils';
import { fieldToTsType, importsToString } from './tsUtils.js';
import { CodegenFile, CodegenStep } from '@aphro/codegen-api';
import TypescriptFile from './TypescriptFile.js';
import {
  SchemaEdge,
  EdgeDeclaration,
  EdgeReferenceDeclaration,
  ID,
  Import,
  SchemaNode,
} from '@aphro/schema-api';
import { nodeFn, edgeFn, tsImport, fieldFn } from '@aphro/schema';

export default class GenTypescriptModel extends CodegenStep {
  static accepts(schema: SchemaNode | SchemaEdge): boolean {
    return true;
  }

  private readonly schema: SchemaNode | SchemaEdge;
  private edges: { [key: string]: SchemaEdge };

  constructor(opts: {
    nodeOrEdge: SchemaNode | SchemaEdge;
    edges: { [key: string]: SchemaEdge };
    dest: string;
  }) {
    super();
    this.schema = opts.nodeOrEdge;
    this.edges = opts.edges;
  }

  async gen(): Promise<CodegenFile> {
    const baseClass = this.schema.type === 'node' ? 'Node' : 'Edge';
    return new TypescriptFile(
      this.schema.name + 'Base.ts',
      `${importsToString(this.collectImports())}

export type Data = ${this.getDataShapeCode()};

${this.schema.type === 'node' ? this.schema.extensions.type?.decorators?.join('\n') || '' : ''}
// @Sealed(${this.schema.name})
export default abstract class ${this.schema.name}Base
  extends ${baseClass}<Data> {
  readonly spec = s as unknown as ${baseClass}SpecWithCreate<this, Data>;

  ${this.getFieldCode()}
  ${this.getEdgeCode()}

  ${this.getQueryAllMethodCode()}

  ${this.getGenxMethodCode()}

  ${this.getGenMethodCode()}

  ${this.getUpdateMethodCode()}

  ${this.getCreateMethodCode()}

  ${this.getDeleteMethodCode()}
}
`,
    );
  }

  private getUpdateMethodCode(): string {
    return `update(data: Partial<Data>) {
      return new UpdateMutationBuilder(this.ctx, this.spec, this).set(data).toChangeset();
    }`;
  }

  private getCreateMethodCode(): string {
    return `static create(ctx: Context, data: Partial<Data>) {
      return new CreateMutationBuilder(ctx, s).set(data).toChangeset();
    }`;
  }

  private getDeleteMethodCode(): string {
    return `delete() {
      return new DeleteMutationBuilder(this.ctx, this.spec, this).toChangeset();
    }`;
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
      tsImport(this.schema.name, null, `./${this.schema.name}.js`),
      tsImport('{default}', 's', './' + nodeFn.specName(this.schema.name) + '.js'),
      tsImport('{P}', null, '@aphro/runtime-ts'),
      tsImport('{UpdateMutationBuilder}', null, '@aphro/runtime-ts'),
      tsImport('{CreateMutationBuilder}', null, '@aphro/runtime-ts'),
      tsImport('{DeleteMutationBuilder}', null, '@aphro/runtime-ts'),
      this.schema.type === 'node'
        ? tsImport('{Node}', null, '@aphro/runtime-ts')
        : tsImport('{Edge}', null, '@aphro/runtime-ts'),
      this.schema.type === 'node'
        ? tsImport('{NodeSpecWithCreate}', null, '@aphro/runtime-ts')
        : tsImport('{EdgeSpecWithCreate}', null, '@aphro/runtime-ts'),
      tsImport('{SID_of}', null, '@aphro/runtime-ts'),
      ...(this.schema.storage.type !== 'ephemeral'
        ? [
            tsImport(
              nodeFn.queryTypeName(this.schema.name),
              null,
              `./${nodeFn.queryTypeName(this.schema.name)}.js`,
            ),
          ]
        : []),
      tsImport('{Context}', null, '@aphro/runtime-ts'),
      ...(this.schema.type === 'node' ? this.schema.extensions.module?.imports.values() || [] : []),
      ...this.getEdgeImports(),
      ...this.getIdFieldImports(),
      ...this.getNestedTypeImports(),
    ].filter(i => i.name !== this.schema.name + 'Base');
  }

  private getIdFieldImports(): Import[] {
    const idFields = Object.values(this.schema.fields)
      .flatMap(f => f.type)
      .filter((f): f is ID => typeof f !== 'string' && f.type === 'id');

    return idFields.map(f => tsImport(f.of, null, './' + f.of + '.js'));
  }

  private getNestedTypeImports(): Import[] {
    const typeFields = Object.values(this.schema.fields)
      .flatMap(f =>
        f.type.map(t => {
          if (typeof t === 'string') {
            return t;
          }

          // TODO: technically we need to recurse into array and map structures to pull imports
          if (t.type === 'array' || t.type === 'map') {
            if (typeof t.values === 'string') {
              return t.values;
            }
          }
        }),
      )
      .filter((f): f is string => f != null);

    return typeFields.map(f => tsImport(f, null, './' + f + '.js'));
  }

  private getEdgeImports(): Import[] {
    if (this.schema.type === 'standaloneEdge') {
      return [];
    }

    const ret: Import[] = [];
    for (const edge of nodeFn.allEdges(this.schema)) {
      const e = edgeFn.dereference(edge, this.edges);
      ret.push(
        tsImport(
          edgeFn.queryTypeName(this.schema, e),
          null,
          './' + edgeFn.queryTypeName(this.schema, e) + '.js',
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
    const ret = Object.values(this.schema.fields).map(field => {
      if (field.name === 'id') {
        return `${field.decorators?.join('\n') || ''}
            get ${field.name}(): SID_of<this> {
              return this.data.${field.name} as unknown as SID_of<this>;
            }
          `;
      }
      return `${field.decorators?.join('\n') || ''}
          get ${field.name}(): ${fieldToTsType(field)} {
            return this.data.${field.name};
          }
        `;
    });

    if (this.schema.type == 'standaloneEdge') {
      ret.push(`get id(): SID_of<this> {
        return (this.data.id1 + '-' + this.data.id2) as SID_of<this>;
      }`);
    }

    return ret.join('\n');
  }

  private getEdgeCode(): string {
    const schema = this.schema;
    if (schema.type === 'standaloneEdge') {
      return '';
    }
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

    return Object.values(schema.extensions.outboundEdges?.edges || {})
      .map(edge => {
        let emptyReturnCondition = '';
        if (edge.type === 'edge') {
          const column = edge.throughOrTo.column;
          if (
            column != null &&
            edge.throughOrTo.type === this.schema.name &&
            fieldFn.isNullable(this.schema.fields[column])
          ) {
            emptyReturnCondition = `if (this.${column} == null) {
              return ${edgeFn.queryTypeName(schema, edge)}.empty(this.ctx);
            }`;
          }
        }

        const e = edgeFn.dereference(edge, this.edges);

        if (e.type === 'standaloneEdge') {
          return `query${upcaseAt(edge.name, 0)}(): ${edgeFn.queryTypeName(schema, e)} {
            return ${nodeFn.queryTypeName(
              schema.name,
            )}.fromId(this.ctx, this.id as any).query${upcaseAt(edge.name, 0)}();
          }`;
        }

        return `query${upcaseAt(edge.name, 0)}(): ${edgeFn.queryTypeName(schema, e)} {
          ${emptyReturnCondition}
          return ${edgeFn.queryTypeName(schema, e)}.${this.getFromMethodInvocation('outbound', e)};
        }`;
      })
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
            `Locally declared edge (${JSON.stringify(
              edge,
            )}) that is not _through_ something is currently unsupported`,
          );
        }

        // through a field on self is a field edge
        // a field edge refers to the id of the destination type.
        if (edge.throughOrTo.type === this.schema.name) {
          return `fromId(this.ctx, this.${column})`;
        }

        // through a field on some other type is a foreign key edge
        // we're thus qurying that type based on some column rather than its id
        return `create(this.ctx).where${upcaseAt(column, 0)}(P.equals(this.id as any))`;
      case 'edgeReference':
        // if (edge.inverted) {
        //   return "fromDst";
        // }
        return 'fromSrc(this.ctx, this.id as any)';
    }
  }

  private getQueryAllMethodCode(): string {
    if (this.schema.storage.type === 'ephemeral') {
      return '';
    }
    return `static queryAll(ctx: Context): ${nodeFn.queryTypeName(this.schema.name)} {
      return ${nodeFn.queryTypeName(this.schema.name)}.create(ctx);
    }`;
  }

  private getGenMethodCode(): string {
    if (this.schema.type === 'standaloneEdge' || this.schema.storage.type === 'ephemeral') {
      return '';
    }
    return `static async gen(ctx: Context, id: SID_of<${this.schema.name}>): Promise<${this.schema.name} | null> {
      const existing = ctx.cache.get(id, ${this.schema.name}.name);
      if (existing) {
        return existing;
      }
      return await this.queryAll(ctx).whereId(P.equals(id)).genOnlyValue();
    }`;
  }

  private getGenxMethodCode(): string {
    if (this.schema.type === 'standaloneEdge' || this.schema.storage.type === 'ephemeral') {
      return '';
    }
    return `static async genx(ctx: Context, id: SID_of<${this.schema.name}>): Promise<${this.schema.name}> {
      const existing = ctx.cache.get(id, ${this.schema.name}.name);
      if (existing) {
        return existing;
      }
      return await this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue();
    }`;
  }
}
