import { ColumnDef, extractColumnDefs, extractTableName, getOldSql } from '../autoMigrate.js';
import connect from '@databases/sqlite';
import { sql } from '@aphro/sql-ts';

const memdb = connect();

const case1 = `-- SIGNED-SOURCE: <6a9f5ec3f74b7ffcb57f08b381c4fc29>
CREATE TABLE
  "user" (
    "id" bigint NOT NULL
    /* n=1 */
,
    "name" text
    /* n=2 */
,
    primary key ("id")
  )`;

const case2 = `-- SIGNED-SOURCE: <5bb42d815d3005cf51bae9f98cd5efa1>
CREATE TABLE
  "decktoeditorsedge" (
    "id1" bigint NOT NULL
    /* n=1 */
,
    "id2" bigint NOT NULL
    /* n=2 */
  )`;

const case3 =
  '-- SIGNED-SOURCE: <39e0ffa72e52ff465fbd19ef78209317>\n' +
  'CREATE TABLE\n' +
  '  "decktoeditorsedge" ("id1" bigint NOT NULL, "id2" bigint NOT NULL)';

const cases = [case1, case2, case3];

test('extract table name', () => {
  [
    [case1, 'user'],
    [case2, 'decktoeditorsedge'],
    [case3, 'decktoeditorsedge'],
  ].forEach(([s, expected]) => {
    const sql = s.replaceAll('\n', '');

    expect(extractTableName(sql)).toBe(expected);
  });
});

test('get old sql', async () => {
  await memdb.query(sql`CREATE TABLE foo (a)`);
  const s = await getOldSql(memdb, 'foo');
  expect(s).toBe('CREATE TABLE foo (a)');
});

test('extract column defs', () => {
  const tests: [string, ColumnDef[]][] = [
    [
      case1,
      [
        {
          num: 1,
          name: 'id',
          type: 'bigint',
          notnull: true,
        },
        {
          num: 2,
          name: 'name',
          type: 'text',
          notnull: false,
        },
      ],
    ],
    [
      case2,
      [
        {
          num: 1,
          name: 'id1',
          type: 'bigint',
          notnull: true,
        },
        {
          num: 2,
          name: 'id2',
          type: 'bigint',
          notnull: true,
        },
      ],
    ],
    [
      case3,
      [
        {
          num: null,
          name: 'id1',
          type: 'bigint',
          notnull: true,
        },
        {
          num: null,
          name: 'id2',
          type: 'bigint',
          notnull: true,
        },
      ],
    ],
  ];

  tests.forEach(([c, expected]) => {
    expect(extractColumnDefs(c.replaceAll('\n', ''))).toEqual(expected);
  });
});
