import { createCompiler } from '@aphro/schema';
import { contents, compiled } from './testSchemaFile.js';
import extension from '../index.js';

const compiler = createCompiler({ grammarExtensions: [extension] });
test('Parsing with the compiled grammar', () => {
  const [errors, result] = compiler.compileFromString(contents);
  expect(result).toEqual(compiled);
});
