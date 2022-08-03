import { CodegenStep, CodegenFile, generatedDir } from '@aphro/codegen-api';
import { SchemaEdge, SchemaNode } from '@aphro/schema-api';
import * as path from 'path';
import TypescriptFile from './TypescriptFile.js';

export class GenSQLExports extends CodegenStep {
  private all: (SchemaNode | SchemaEdge)[];
  constructor(nodes: SchemaNode[], edges: SchemaEdge[], private schemaFileName: string) {
    super();
    this.all = [...nodes, ...edges].filter(x => x.storage.type === 'sql');
  }

  static accepts(nodes: SchemaNode[], edges: SchemaEdge[]): boolean {
    return nodes.some(n => n.storage.type === 'sql') || edges.some(e => e.storage.type === 'sql');
  }

  async gen(): Promise<CodegenFile> {
    const filename = 'exports-sql.ts';

    // group nodes and edges by db
    // export sql files by db name
    const grouped: { [key: string]: (SchemaNode | SchemaEdge)[] } = {};
    for (const nore of this.all) {
      const key = nore.storage.engine + '_' + nore.storage.db;
      const existing = grouped[key];
      if (existing) {
        existing.push(nore);
      } else {
        grouped[key] = [nore];
      }
    }

    return new TypescriptFile(path.join(generatedDir, filename), this.getCode(grouped));
  }

  private getCode(groups: { [key: string]: (SchemaNode | SchemaEdge)[] }): string {
    return `${this.all.map(this.getImport).join('\n')}
    export default {
      ${Object.entries(groups).map(this.getCodeForGroup).join(',\n')}
    }`;
  }

  private getImport(nore: SchemaEdge | SchemaNode): string {
    return `import ${nore.name}SQL from './${nore.name}.${nore.storage.engine}.sql?raw';`;
  }

  private getCodeForGroup([key, nores]: [string, (SchemaEdge | SchemaNode)[]]): string {
    return `'${key}': {
      ${nores.map(x => x.name + 'SQL').join(',\n')}
    }`;
  }
}
