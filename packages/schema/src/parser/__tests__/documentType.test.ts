import { createParser } from '../parse.js';
import { contents } from './documentSchemaFile';

const { parseString } = createParser();
test('Parsing with the compiled grammar', () => {
  const parsed = parseString(contents);
  console.log(parsed);
});
