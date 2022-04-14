import { createCompiler } from '@aphro/schema';
import { contents, compiled } from './testSchemaFile.js';
import extension from '../index.js';

const compiler = createCompiler({ extensions: [extension] });
test('Parsing with the compiled grammar', () => {
  const result = compiler.compileFromString(contents);
  expect(result).toEqual(compiled);
});
