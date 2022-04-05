import { CodegenFile } from "../../codegen/CodegenFile.js";
import CodegenStep from "../../codegen/CodegenStep.js";

export default class GenTypeGraphQL extends CodegenStep {
  gen(): CodegenFile {
    return {
      name: "",
      contents: "",
    };
  }
}
