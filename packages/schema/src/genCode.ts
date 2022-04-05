import compile from "./compile.js";
import { stopsCodegen } from "./validate.js";

export function genCode(schemaFilePath: string, outputFolderPath: string) {
  const [errors, schemaFile] = compile(schemaFilePath);

  if (errors.some((e) => stopsCodegen(e))) {
    throw errors;
  }
}
