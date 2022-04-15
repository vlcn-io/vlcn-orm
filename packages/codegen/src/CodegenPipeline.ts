import { maybeMap } from '@strut/utils';
import GenTypescriptModel from './typescript/GenTypescriptModel.js';
import * as fs from 'fs';
import GenTypescriptQuery from './typescript/GenTypescriptQuery.js';
import GenMySqlTableSchema from './mysql/GenMySQLTableSchema.js';
import GenPostgresTableSchema from './postgres/GenPostgresTableSchema.js';
import { Node, Edge } from '@aphro/schema-api';
import GenTypescriptSpec from './typescript/GenTypescriptSpec.js';
import GenSqliteTableSchema from './sqlite/GenSqliteTableSchema.js';
import { Step } from '@aphro/codegen-api';

const defaultSteps: readonly Step[] = [
  GenTypescriptModel,
  GenTypescriptQuery,
  GenTypescriptSpec,
  GenMySqlTableSchema,
  GenPostgresTableSchema,
  GenSqliteTableSchema,
];

export default class CodegenPipleine {
  constructor(private readonly steps: readonly Step[] = defaultSteps) {}

  async gen(schemas: (Node | Edge)[], dest: string) {
    const files = schemas.flatMap(schema =>
      maybeMap(this.steps, step => (!step.accepts(schema) ? null : new step(schema).gen())),
    );

    await Promise.all(
      files.map(async f => await fs.promises.writeFile(dest + '/' + f.name, f.contents)),
    );
  }
}
