import Schema from '../schema/Schema';
import CodegenStep from './CodegenStep.js';
import GenTypescriptModel from './GenTypescriptModel.js';
import * as fs from 'fs';

const defaultSteps: Array<{ new(Schema): CodegenStep; }> = [
  GenTypescriptModel,
];

export default class CodegenPipleine {

  constructor(
    private readonly steps: Array<{ new(Schema): CodegenStep; }> = defaultSteps,
  ) { }

  gen(
    schemas: Array<Schema>,
    dest: string,
  ) {
    const code = schemas.map(
      schema =>
        this.steps.map(step => new step(schema).gen()),
    );

    // Promise.all(code.map(async c => await fs.promises.writeFile(dest, c)));
  }
}
