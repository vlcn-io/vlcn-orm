import condense from "../parser/condense.js";
import validate, { ValidationError } from "./validate.js";
import parse, { parseString } from "../parser/parse.js";
import { SchemaFile, SchemaFileAst } from "../parser/SchemaType.js";

export default function compile(path: string): [ValidationError[], SchemaFile] {
  return compileFromAst(parse(path));
}

export function compileFromString(
  contents: string
): [ValidationError[], SchemaFile] {
  const ast = parseString(contents);
  return compileFromAst(ast);
}

export function compileFromAst(
  ast: SchemaFileAst
): [ValidationError[], SchemaFile] {
  const [condenseErrors, schemaFile] = condense(ast);

  const validationErrors = validate(schemaFile);

  return [[...condenseErrors, ...validationErrors], schemaFile];
}
