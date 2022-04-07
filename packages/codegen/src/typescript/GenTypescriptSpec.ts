import { CodegenFile, CodegenStep } from '@aphro/codegen-api';
import { edgeFn, tsImport } from '@aphro/schema';
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
    return new TypescriptFile(
      this.schema.name + 'Spec.ts',
      `import {ModelSpec} from '@aphro/model-runtime-ts';
${importsToString(this.getEdgeImports())}

${this.getSpecCode()}
`,
    );
  }

  private getSpecCode(): string {
    return `const spec: ModelSpec<Data> = {
  createFrom(data: Data) {
    return new ${this.schema.name}(data);
  },

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

  private getOutboundEdgeSpecCode(): string {
    return Object.values(this.schema.extensions.outboundEdges?.edges || [])
      .map(edge => edge.name + ': ' + this.getSpecForEdge(edge))
      .join(',\n');
  }

  private getSpecForEdge(edge: EdgeDeclaration | EdgeReferenceDeclaration): string {
    return '""';
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
