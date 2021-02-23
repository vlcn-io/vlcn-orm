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

  async gen(
    schemas: Array<Schema>,
    dest: string,
  ) {
    const schemaResults = schemas.map(
      schema =>
        this.steps.map(step => new step(schema).gen()),
    );

    await Promise.all(
      schemaResults.map(
        async r => await Promise.all(
          r.map(async f => await fs.promises.writeFile(dest + '/' + f.name, f.contents))
        )
      )
    );
  }
}
