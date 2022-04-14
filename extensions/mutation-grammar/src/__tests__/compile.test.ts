import { compileFromString, configure } from '@aphro/schema';
import { contents, compiled } from './testSchemaFile.js';
import extension from '../index.js';

test('Parsing with the compiled grammar', () => {
  configure({ extensions: [extension] });
  const compiled = compileFromString(contents);
  expect(compiled).toEqual(compiled);
});
