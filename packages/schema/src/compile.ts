import condense from './parser/condense.js';
import validate from './validate.js';
import { createParser } from './parser/parse.js';
import { SchemaFile, SchemaFileAst, ValidationError } from '@aphro/schema-api';
import { Config } from './runtimeConfig.js';

export function createCompiler(config: Config = {}) {
  const parser = createParser(config);

  const condensors: Map<string | Symbol, (arg0: any) => any> = new Map();
  config.grammarExtensions?.forEach(e => {
    if (condensors.has(e.name)) {
      throw new Error('Condensor already exists for a plugin with the name/symbol ' + e.name);
    }
    condensors.set(e.name, e.condensor);
  });

  function compile(path: string): [ValidationError[], SchemaFile] {
    return compileFromAst(parser.parse(path));
  }

  function compileFromString(contents: string): [ValidationError[], SchemaFile] {
    const ast = parser.parseString(contents);
    return compileFromAst(ast);
  }

  function compileFromAst(ast: SchemaFileAst): [ValidationError[], SchemaFile] {
    const [condenseErrors, schemaFile] = condense(ast, condensors);

    const validationErrors = validate(schemaFile);

    return [[...condenseErrors, ...validationErrors], schemaFile];
  }

  return {
    compile,
    compileFromString,
    compileFromAst,
  };
}
