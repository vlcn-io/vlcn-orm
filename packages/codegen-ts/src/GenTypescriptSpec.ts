import { CodegenFile, CodegenStep } from '@aphro/codegen-api';
import { edgeFn, nodeFn, tsImport } from '@aphro/schema';
import {
  SchemaEdge,
  EdgeDeclaration,
  EdgeReferenceDeclaration,
  Import,
  SchemaNode,
} from '@aphro/schema-api';
import { importsToString } from './tsUtils.js';
import TypescriptFile from './TypescriptFile.js';

export default class GenTypescriptSpec extends CodegenStep {
  static accepts(_schema: SchemaNode | SchemaEdge): boolean {
    return true;
  }

  private schema: SchemaNode | SchemaEdge;
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
    const imports = this.collectImports();
    return new TypescriptFile(
      this.schema.name + 'Spec.ts',
      `${importsToString(imports)}

${this.getSpecCode()}
`,
    );
  }

  private getSpecCode(): string {
    let primaryKeyCode = '';
    let cacheKey = '';
    let sourceDestFields = '';
    const nodeOrEdge = this.schema.type === 'node' ? 'Node' : 'Edge';
    if (this.schema.type === 'node') {
      primaryKeyCode = `primaryKey: '${this.schema.primaryKey}',`;
      cacheKey = `data['${this.schema.primaryKey}']`;
    } else {
      cacheKey = `(data.id1 + '-' + data.id2) as SID_of<${this.schema.name}>`;
      sourceDestFields = `
        sourceField: "id1",
        destField: "id2",
        get source() { return ${nodeFn.specName(this.schema.src.type)}; },
        get dest() { return ${nodeFn.specName(this.schema.dest.type, this.schema.name)}; },
      `;
    }

    return `const spec: ${nodeOrEdge}SpecWithCreate<${this.schema.name}, Data> = {
      type: '${this.schema.type === 'node' ? 'node' : 'junction'}',
  createFrom(ctx: Context, data: Data) {
    ${this.getCreateFromBody(cacheKey)}
  },

  ${primaryKeyCode}
  ${sourceDestFields}

  storage: {
    engine: "${this.schema.storage.engine}",
    db: "${this.schema.storage.db}",
    type: "${this.schema.storage.type}",
    tablish: "${this.schema.storage.tablish}",
  },

  ${this.getOutboundEdgeSpecCode()}
};

export default spec;
`;
  }

  private getCreateFromBody(cacheKey: string): string {
    if (this.schema.storage.type === 'ephemeral') {
      return `new ${this.schema.name}(ctx, data);`;
    }

    return `const existing = ctx.cache.get(${cacheKey}, ${this.schema.name}.name);
    if (existing) {
      return existing;
    }
    const result = new ${this.schema.name}(ctx, data);
    ctx.cache.set(${cacheKey}, result);
    return result;`;
  }

  private collectImports(): Import[] {
    return [
      tsImport('{Context}', null, '@aphro/runtime-ts'),
      tsImport('{SID_of}', null, '@aphro/runtime-ts'),
      this.schema.type === 'node'
        ? tsImport('{NodeSpecWithCreate}', null, '@aphro/runtime-ts')
        : tsImport('{EdgeSpecWithCreate}', null, '@aphro/runtime-ts'),
      ...this.getEdgeImports(),
      tsImport(this.schema.name, null, `./${this.schema.name}.js`),
      tsImport('{Data}', null, `./${this.schema.name}.js`),
      tsImport(
        '{default}',
        nodeFn.specName(this.schema.name),
        `./${nodeFn.specName(this.schema.name)}.js`,
      ),
    ].filter(i => i.as !== nodeFn.specName(this.schema.name));
  }

  private getOutboundEdgeSpecCode(): string {
    if (this.schema.type === 'standaloneEdge') {
      return '';
    }
    return `outboundEdges: {
      ${Object.values(this.schema.extensions.outboundEdges?.edges || [])
        .map(edge => edge.name + ': ' + this.getSpecForEdge(edge))
        .join(',\n')}
      }`;
  }

  private getSpecForEdge(edge: EdgeDeclaration | EdgeReferenceDeclaration): string {
    const schema = this.schema;
    if (schema.type === 'standaloneEdge') {
      return '';
    }
    // reference declaration would just reference the generated junction spec
    // and otherwise we declare an inline spec
    const e = edgeFn.dereference(edge, this.edges);
    const edgeType = edgeFn.outboundEdgeType(schema, e);
    const sourceField = edgeFn.outboundEdgeSourceField(schema, e).name;
    const destField = edgeFn.outboundEdgeDestFieldName(schema, e);
    const sourceFn = 'get source() { return spec; }';
    const destType = edgeFn.destModelSpecName(schema, e);
    const destFn = `get dest() { return ${destType}; }`;

    switch (edgeType) {
      case 'field':
        return `{
          type: '${edgeType}',
          sourceField: '${sourceField}',
          destField: '${destField}',
          ${sourceFn},
          ${destFn},
        }`;
      case 'junction':
        const storageConfig = edgeFn.storageConfig(e);
        // return this or import a standalone generated junction edge def?
        return `{
          type: '${edgeType}',
          storage: {
            type: "${storageConfig.type}",
            engine: "${storageConfig.engine}",
            db: "${storageConfig.db}",
            tablish: "${storageConfig.tablish}",
          },
          sourceField: '${sourceField}',
          destField: '${destField}',
          ${sourceFn},
          ${destFn},
        }`;
      case 'foreignKey':
        return `{
          type: '${edgeType}',
          sourceField: '${sourceField}',
          destField: '${destField}',
          ${sourceFn},
          ${destFn},
        }`;
    }
  }

  private getEdgeImports(): Import[] {
    const schema = this.schema;
    if (schema.type === 'standaloneEdge') {
      return [
        tsImport(
          '{default}',
          nodeFn.specName(schema.src.type),
          `./${nodeFn.specName(schema.src.type)}.js`,
        ),
        tsImport(
          '{default}',
          nodeFn.specName(schema.dest.type),
          `./${nodeFn.specName(schema.dest.type)}.js`,
        ),
      ];
    }
    const outbound = Object.values(schema.extensions.outboundEdges?.edges || {}).map(e =>
      edgeFn.dereference(e, this.edges),
    );
    return outbound
      .filter(edge => edgeFn.destModelTypeName(schema, edge) !== schema.name)
      .map(edge =>
        tsImport(
          '{default}',
          `${edgeFn.destModelSpecName(schema, edge)}`,
          `./${edgeFn.destModelSpecName(schema, edge)}.js`,
        ),
      );
  }
}
