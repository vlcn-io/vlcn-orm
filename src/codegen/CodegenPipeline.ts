import Schema from '../schema/Schema';
import CodegenStep from './CodegenStep.js';
import GenTypescriptModel from './GenTypescriptModel.js';

const defaultSteps = [
  GenTypescriptModel,
];

export default class CodegenPipleine {

  constructor(private readonly steps: Array<CodegenStep> = defaultSteps) {}

  gen(
    schemas: Array<Schema>,
    dest: string,
  ) {
    console.log(schemas);
  }
}
