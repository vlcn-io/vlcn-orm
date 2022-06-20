import { CodegenFile, CodegenStep } from '@aphro/codegen-api';
import { edgeFn, nodeFn, tsImport } from '@aphro/schema';
import { Edge, EdgeDeclaration, EdgeReferenceDeclaration, Import, Node } from '@aphro/schema-api';
import { importsToString } from './tsUtils.js';
import TypescriptFile from './TypescriptFile.js';

export default class GenTypescriptSpec extends CodegenStep {
  static accepts(_schema: Node | Edge): boolean {
    return true;
  }

  private schema: Node;
  private edges: { [key: string]: Edge };
  constructor(opts: { nodeOrEdge: Node; edges: { [key: string]: Edge }; dest: string }) {
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
    return `const spec: ModelSpec<${this.schema.name}, Data> = {
  createFrom(ctx: Context, data: Data) {
    const existing = ctx.cache.get(data['${this.schema.primaryKey}']);
    if (existing) {
      return existing;
    }
    const result = new ${this.schema.name}(ctx, data);
    ctx.cache.set(data['${this.schema.primaryKey}'], result);
    return result;
  },

  primaryKey: '${this.schema.primaryKey}',

  storage: {
    engine: "${this.schema.storage.engine}",
    db: "${this.schema.storage.db}",
    type: "${this.schema.storage.type}",
    tablish: "${this.schema.storage.tablish}",
  },

  outboundEdges: {
    ${this.getOutboundEdgeSpecCode()}
  }
};

export default spec;
`;
  }

  private collectImports(): Import[] {
    return [
      tsImport('{Context}', null, '@aphro/runtime-ts'),
      tsImport('{ModelSpec}', null, '@aphro/runtime-ts'),
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
    return Object.values(this.schema.extensions.outboundEdges?.edges || [])
      .map(edge => edge.name + ': ' + this.getSpecForEdge(edge))
      .join(',\n');
  }

  private getSpecForEdge(edge: EdgeDeclaration | EdgeReferenceDeclaration): string {
    // reference declaration would just reference the generated junction spec
    // and otherwise we declare an inline spec
    const e = edgeFn.dereference(edge, this.edges);
    const edgeType = edgeFn.outboundEdgeType(this.schema, e);
    const sourceField = edgeFn.outboundEdgeSourceField(this.schema, e).name;
    const destField = edgeFn.outboundEdgeDestFieldName(this.schema, e);
    const sourceFn = 'get source() { return spec; }';
    const destType = edgeFn.destModelSpecName(this.schema, e);
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
    const outbound = Object.values(this.schema.extensions.outboundEdges?.edges || {}).filter(
      e => e.type === 'edge',
    ) as EdgeDeclaration[];
    return outbound
      .filter(edge => edgeFn.destModelTypeName(this.schema, edge) !== this.schema.name)
      .map(edge =>
        tsImport(
          '{default}',
          `${edgeFn.destModelSpecName(this.schema, edge)}`,
          `./${edgeFn.destModelSpecName(this.schema, edge)}.js`,
        ),
      );
  }
}
