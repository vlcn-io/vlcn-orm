import { CodegenFile } from "./CodegenFile.js";

export default abstract class CodegenStep {
  constructor() {}

  abstract gen(): CodegenFile;
}
