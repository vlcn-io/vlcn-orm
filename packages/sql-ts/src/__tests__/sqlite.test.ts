// const checkedFormatString = sql`SELECT * FROM ${'T'} WHERE ${'C'} = ${'d'}`;

import { sql, formatters } from '../sql.js';
import fc from 'fast-check';

const idChar = () => fc.integer({ min: 65, max: 122 }).map(String.fromCharCode);
const identifier = () =>
  fc.array(idChar(), { minLength: 1, maxLength: 10 }).map(arr => arr.join(''));

const identifierArray = () => fc.array(identifier());

test('SELECT * FROM T', () => {
  fc.assert(
    fc.property(identifier(), table => {
      expect(sql`SELECT * FROM ${sql.ident(table)}`.format(formatters.sqlite).text).toEqual(
        'SELECT * FROM "' + table + '"',
      );
    }),
  );
});

test('SELECT C FROM T', () => {
  fc.assert(
    fc.property(identifier(), identifier(), (column, table) => {
      expect(
        sql`SELECT ${sql.ident(column)} FROM ${sql.ident(table)}`.format(formatters.sqlite).text,
      ).toEqual('SELECT "' + column + '" FROM "' + table + '"');
    }),
  );
});

// test('SELECT T.C FROM T', () => {
//   fc.assert(
//     fc.property(identifier(), identifier(), (column, table) => {
//       expect(
//         sql`SELECT ${'C'} FROM ${'T'}`(table + '.' + column, table).toString('sqlite'),
//       ).toEqual(['SELECT `' + table + '`.`' + column + '` FROM `' + table + '`;', []]);
//     }),
//   );
// });

// test('SELECT LC FROM T', () => {
//   fc.assert(
//     fc.property(identifierArray(), identifier(), (columns, table) => {
//       expect(sql`SELECT ${'LC'} FROM ${'T'}`(columns, table).toString('sqlite')).toEqual([
//         'SELECT ' + columns.map(c => '`' + c + '`').join(', ') + ' FROM `' + table + '`;',
//         [],
//       ]);
//     }),
//   );
// });

// test('SELECT * FROM (SELECT * FROM T) as T', () => {
//   expect(
//     sql`SELECT * FROM (${'Q'}) as ${'T'}`(sql`SELECT * FROM ${'T'}`('t1'), 't2').toString('sqlite'),
//   ).toEqual(['SELECT * FROM (SELECT * FROM `t1`) as `t2`;', []]);
// });

// // We should create an arbitrary the goes through all possible data types.
// test('INSERT INTO T VALUES (d, s, s)', () => {
//   fc.assert(
//     fc.property(fc.integer(), fc.string(), fc.string(), (num, string1, string2) => {
//       expect(
//         sql`INSERT INTO ${'T'} VALUES (${'d'}, ${'s'}, ${'s'})`(
//           'table',
//           num,
//           string1,
//           string2,
//         ).toString('sqlite'),
//       ).toEqual(['INSERT INTO `table` VALUES (?, ?, ?);', [num, string1, string2]]);
//     }),
//   );
// });

// test('Multi row insert', () => {});

// test('SELECT * FROM T WHERE C = d', () => {
//   expect(
//     sql`SELECT * FROM ${'T'} WHERE ${'C'} = ${'d'}`('table', 'col', 1).toString('sqlite'),
//   ).toEqual(['SELECT * FROM `table` WHERE `col` = ?;', [1]]);
// });

// test('SELECT * FROM (SELECT * FROM T WHERE C = d) WHERE C = d', () => {
//   expect(
//     sql`SELECT * FROM (${'Q'}) WHERE C = ${'d'}`(
//       sql`SELECT * FROM ${'T'} WHERE C = ${'d'}`('table1', 1),
//       2,
//     ).toString('sqlite'),
//   ).toEqual(['SELECT * FROM (SELECT * FROM `table1` WHERE C = ?) WHERE C = ?;', [1, 2]]);
// });
