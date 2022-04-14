import { createParser } from '../parse.js';
import { contents, ast } from './testSchemaFile.js';

const { parseString } = createParser();
test('Parsing with the compiled grammar', () => {
  const parsed = parseString(contents);
  expect(parsed).toEqual(ast);
});
