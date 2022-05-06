import { CodegenFile, CodegenStep } from '@aphro/codegen-api';
import { edgeFn, nodeFn, tsImport } from '@aphro/schema';
import { EdgeDeclaration, EdgeReferenceDeclaration, Import, Node } from '@aphro/schema-api';
import { importsToString } from './tsUtils.js';
import TypescriptFile from './TypescriptFile.js';

export default class GenTypescriptSpec extends CodegenStep {
  static accepts(_schema: Node): boolean {
    return true;
  }

  constructor(private schema: Node) {
    super();
  }

  gen(): CodegenFile {
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
  createFrom(data: Data) {
    return new ${this.schema.name}(data);
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
      tsImport('{ModelSpec}', null, '@aphro/model-runtime-ts'),
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
    if (edge.type === 'edgeReference') {
      throw new Error('Edge references not yet supported');
    }
    const edgeType = edgeFn.outboundEdgeType(this.schema, edge);
    const sourceField = edgeFn.outboundEdgeSourceField(this.schema, edge).name;
    const destField = edgeFn.outboundEdgeDestFieldName(this.schema, edge);
    const sourceFn = 'get source() { return spec; }';
    const destType = edgeFn.destModelSpecName(this.schema, edge);

    switch (edgeType) {
      case 'field':
        return `{
          type: '${edgeType}',
          sourceField: '${sourceField}',
          destField: '${destField}',
          ${sourceFn},
          dest: ${destType},
        }`;
      case 'junction':
        return `{
          type: '${edgeType}',
          storage: {},
          sourceField: '${sourceField}',
          destField: '${destField}',
          ${sourceFn},
          dest: ${destType},
        }`;
      case 'foreignKey':
        return `{
          type: '${edgeType}',
          sourceField: '${sourceField}',
          destField: '${destField}',
          ${sourceFn},
          dest: ${destType}
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
