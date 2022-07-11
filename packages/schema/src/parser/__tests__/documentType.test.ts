import { createParser } from '../parse.js';
import { contents } from './documentSchemaFile';

const { parseString } = createParser();
test('Parsing with the compiled grammar', () => {
  const parsed = parseString(contents);
  expect(parsed).toEqual(ast);
});

const ast = {
  preamble: {},
  entities: [
    {
      type: 'node',
      as: 'UnmanagedNode',
      name: 'Application',
      fields: [{ name: 'currentScreen', type: ['HomeScreen', { type: 'union' }, 'ProfileScreen'] }],
      extensions: [],
    },
    { type: 'node', as: 'UnmanagedNode', name: 'HomeScreen', fields: [], extensions: [] },
    { type: 'node', as: 'UnmanagedNode', name: 'ProfileScreen', fields: [], extensions: [] },
  ],
};
