import { SchemaEdge, SchemaNode } from '@aphro/schema-api';
import { GenSQLExports } from './GenSQLExports.js';

export class GenSQLExports_node extends GenSQLExports {
  protected getImports() {
    return `
import * as path from 'path';
import * as fs from 'fs';

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
