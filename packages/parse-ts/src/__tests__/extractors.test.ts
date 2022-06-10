import { exports, imports } from '../extractors.js';
import { stringToAst } from '../toAst.js';

const file = `
import foo from './boo';
import bar from './baz';

const x = 1;
const y = 2;

export function one() {}
export function two() {}
`;

test('extracting import statements', () => {
  const ast = stringToAst('test', file);
  expect(imports(ast).map(e => e.importClause?.name?.escapedText)).toEqual(['foo', 'bar']);
});

test('extracting export statements', () => {
  const ast = stringToAst('test', file);
  const exported = exports(ast);

  expect(exported.map(e => e.name?.escapedText)).toEqual(['one', 'two']);
});
