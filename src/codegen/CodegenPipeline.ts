import GenTypeGraphQL from '../integrations/type_graphql/GenTypeGraphQL.js';
import Schema from '../schema/Schema';
import CodegenStep from './CodegenStep.js';
import GenTypescriptModel from './GenTypescriptModel.js';

const defaultSteps: Array<{ new(Schema): CodegenStep; }> = [
  GenTypescriptModel,
  GenTypeGraphQL,
];

export default class CodegenPipleine {

  constructor(
    private readonly steps: Array<{ new(Schema): CodegenStep; }> = defaultSteps,
  ) { }

  gen(
    schemas: Array<Schema>,
    dest: string,
  ) {
    console.log(schemas.map(
      schema =>
        this.steps.map(step => new step(schema).gen()),
    ));
  }
}
