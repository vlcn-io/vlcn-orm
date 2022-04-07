import { maybeMap } from '@strut/utils';
import GenTypescriptModel from './typescript/GenTypescriptModel.js';
import * as fs from 'fs';
import GenTypescriptQuery from './typescript/GenTypescriptQuery.js';
import GenMySqlTableSchema from './mysql/GenMySQLTableSchema.js';
import GenPostgresTableSchema from './postgres/GenPostgresTableSchema.js';
import GenTypescriptSpec from './typescript/GenTypescriptSpec.js';
const defaultSteps = [
    GenTypescriptModel,
    GenTypescriptQuery,
    GenTypescriptSpec,
    GenMySqlTableSchema,
    GenPostgresTableSchema,
];
export default class CodegenPipleine {
    steps;
    constructor(steps = defaultSteps) {
        this.steps = steps;
    }
    async gen(schemas, dest) {
        const files = schemas.flatMap(schema => maybeMap(this.steps, step => (!step.accepts(schema) ? null : new step(schema).gen())));
        await Promise.all(files.map(async (f) => await fs.promises.writeFile(dest + '/' + f.name, f.contents)));
    }
}
//# sourceMappingURL=CodegenPipeline.js.map