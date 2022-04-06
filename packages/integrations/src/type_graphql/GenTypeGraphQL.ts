import { CodegenFile } from '../../../model/src/codegen/CodegenFile.js';
import CodegenStep from '../../../model/src/codegen/CodegenStep.js';

export default class GenTypeGraphQL extends CodegenStep {
  gen(): CodegenFile {
    return {
      name: '',
      contents: '',
    };
  }
}
