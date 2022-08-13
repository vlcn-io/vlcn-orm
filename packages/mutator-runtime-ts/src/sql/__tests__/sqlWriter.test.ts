import { noopDebugContext } from '@aphro/context-runtime-ts';
import { viewer } from '@aphro/context-runtime-ts/lib/viewer';
import { asId } from '@strut/sid';
import { Node } from '@aphro/model-runtime-ts';

import writer from '../sqlWriter.js';
import { formatters } from '@aphro/sql-ts';

class TestModel extends Node<{ thing: number; foo: number }> {
  readonly id = asId<this>('foo');
  readonly spec = {
    type: 'node',
    primaryKey: 'id',
    storage: {
      engine: 'postgres',
      db: 'test',
      tablish: 'testmodel',
    },
    fields: {
      thing: {
        encoding: 'none',
      },
      foo: {
        encoding: 'none',
      },
    },
  } as any;
}

class TestListeModel extends Node<{ thing: number; foo: number }> {
  readonly id = asId<this>('foo');
  readonly spec = {
    type: 'node',
    primaryKey: 'id',
    storage: {
      engine: 'sqlite',
      db: 'test',
      tablish: 'testmodel',
    },
    fields: {
      thing: {
        encoding: 'none',
      },
      foo: {
        encoding: 'none',
      },
    },
  } as any;
}

const context = noopDebugContext(viewer(asId('1')));
test('upsert pg group', () => {
  const m1 = new TestModel(context, { thing: 1, foo: 2 });
  const m2 = new TestModel(context, { thing: 3, foo: 4 });

  const sql = writer.buildUpsertSql([m1, m2]);
  const formatted = sql.format(formatters.postgres);

  expect(formatted.text).toEqual(
    'INSERT INTO "testmodel" ("thing", "foo") VALUES ($1, $2), ($3, $4) ON CONFLICT ("id") DO UPDATE SET "thing" = EXCLUDED."thing", "foo" = EXCLUDED."foo"',
  );
  expect(formatted.values).toEqual([1, 2, 3, 4]);
});

test('upsert sqlite group', () => {
  const m1 = new TestListeModel(context, { thing: 1, foo: 2 });
  const m2 = new TestListeModel(context, { thing: 3, foo: 4 });

  const sql = writer.buildUpsertSql([m1, m2]);
  const formatted = sql.format(formatters.sqlite);

  expect(formatted.text).toEqual(
    'INSERT OR REPLACE INTO "testmodel" ("thing", "foo") VALUES (?, ?), (?, ?)',
  );
  expect(formatted.values).toEqual([1, 2, 3, 4]);
});
