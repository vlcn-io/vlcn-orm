import { CodegenStep, CodegenFile, generatedDir } from '@aphro/codegen-api';
import { SchemaEdge, SchemaNode } from '@aphro/schema-api';
import * as path from 'path';
import TypescriptFile from './TypescriptFile.js';

export class GenSQLExports extends CodegenStep {
  protected all: (SchemaNode | SchemaEdge)[];
  constructor(nodes: SchemaNode[], edges: SchemaEdge[], private schemaFileName: string) {
    super();
    this.all = [...nodes, ...edges].filter(x => x.storage.type === 'sql');
  }

  static accepts(nodes: SchemaNode[], edges: SchemaEdge[]): boolean {
    return nodes.some(n => n.storage.type === 'sql') || edges.some(e => e.storage.type === 'sql');
  }

  async gen(): Promise<CodegenFile> {
    // group nodes and edges by db
    // export sql files by db name
    const grouped: { [key: string]: { [key: string]: (SchemaNode | SchemaEdge)[] } } = {};
    for (const nore of this.all) {
      let existingEngine = grouped[nore.storage.engine];
      if (!existingEngine) {
        existingEngine = {};
        grouped[nore.storage.engine] = existingEngine;
      }
      let existingDb = existingEngine[nore.storage.db];
      if (existingDb) {
        existingDb.push(nore);
      } else {
        existingEngine[nore.storage.db] = [nore];
      }
    }

    return new TypescriptFile(path.join(generatedDir, this.getFilename()), this.getCode(grouped));
  }

  protected getFilename() {
    return 'exports-sql.ts';
  }

  private getCode(groups: {
    [key: string]: { [key: string]: (SchemaNode | SchemaEdge)[] };
  }): string {
    return `${this.getImports()}
    export default {
      ${Object.entries(groups).map(this.getCodeForGroup).join(',\n')}
    }`;
  }

  protected getImports() {
    return this.all.map(this.getImport).join('\n');
  }

  private getImport(nore: SchemaEdge | SchemaNode): string {
    return `import ${nore.name} from './${nore.name}.${nore.storage.engine}.sql?raw';`;
  }

  private getCodeForGroup([engine, dbs]: [
    string,
    { [key: string]: (SchemaEdge | SchemaNode)[] },
  ]): string {
    return `'${engine}': {
      ${Object.entries(dbs)
        .map(
          ([db, nores]) => `'${db}': {
          ${nores.map(x => x.name).join(',\n')}
        }`,
        )
        .join(',\n')}
    }`;
  }
}
