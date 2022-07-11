import { createParser } from '../parse.js';
import { contents, ast } from './testSchemaFile.js';

const { parseString } = createParser();
test('Parsing with the compiled grammar', () => {
  const parsed = parseString(contents);
  // Getting a shit ton of output on this line when the test fails?
  // You probably forgot to call `.toAst` or `.sourceString` on some parameter in `parse.ts`
  expect(parsed).toEqual(ast);
});
