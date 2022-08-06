import { SchemaEdge, SchemaNode } from '@aphro/schema-api';
import { GenSQLExports } from './GenSQLExports.js';

export class GenSQLExports_node extends GenSQLExports {
  protected getImports() {
    // The user might not want to pull node types into their project. Makes sense if it is a browser project.
    // So ts-ignore these.
    return `
// @ts-ignore
import * as path from 'path';
// @ts-ignore
import * as fs from 'fs';

// @ts-ignore
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const [${this.all.map(nore => nore.name).join(',\n')}] = await Promise.all([
  ${this.all.map(this.getReadFileCode).join(',\n')}
]);
`;
  }

  protected getFilename() {
    return 'exports-node-sql.ts';
  }

  private getReadFileCode(nore: SchemaNode | SchemaEdge): string {
    return `fs.promises.readFile(path.join(__dirname, '${nore.name}.${nore.storage.engine}.sql'), {encoding: "utf8"})`;
  }
}
