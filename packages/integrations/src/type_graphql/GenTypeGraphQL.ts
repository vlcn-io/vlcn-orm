import { CodegenFile, CodegenStep } from '@aphro/codegen-api';

export default class GenTypeGraphQL extends CodegenStep {
  gen(): CodegenFile {
    return {
      name: '',
      contents: '',
    };
  }
}
