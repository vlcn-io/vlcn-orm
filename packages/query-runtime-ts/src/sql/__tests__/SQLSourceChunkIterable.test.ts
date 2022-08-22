import Cache from '@aphro/cache-runtime-ts';
import {
  anonymous,
  basicResolver,
  Context,
  context,
  debugContext,
  SQLResolvedDB,
} from '@aphro/context-runtime-ts';
import { MemoryDB, Node } from '@aphro/model-runtime-ts';
import { NodeSpec } from '@aphro/schema-api';
import { sql, SQLQuery } from '@aphro/sql-ts';
import { asId, SID_of } from '@strut/sid';
import { filter } from '../../Expression';
import { ModelFieldGetter } from '../../Field';
import P from '../../Predicate';
import SQLSourceChunkIterable from '../SQLSourceChunkIterable';

let db: SQLResolvedDB;
let cache: Cache;
let ctx: Context;
let data: any[];
const spec: NodeSpec = {
  type: 'node',
  primaryKey: 'id',
  storage: {
    db: 'test',
    engine: 'sqlite',
    tablish: 'test',
    type: 'sql',
  },
  fields: {},
  outboundEdges: {},
};
type Data = {
  id: SID_of<TestModel>;
  x: string;
};
class TestModel extends Node<Data> {
  readonly spec = {} as any;
  constructor(data: Data) {
    super(ctx, data);
  }

  get id(): SID_of<this> {
    return this.data.id as SID_of<this>;
  }
}

beforeEach(() => {
  data = [];
  cache = new Cache();

  db = {
    async read(q: SQLQuery): Promise<any[]> {
      return data;
    },
    async write(q: SQLQuery): Promise<void> {},
    async transact<T>(cb: (conn: SQLResolvedDB) => Promise<T>) {
      return await cb(db);
    },

    dispose() {},
  };

  ctx = context(anonymous(), basicResolver('test', db), cache);
});

test('does a direct load if possible and the thing is cached', async () => {
  const id = '1' as SID_of<TestModel>;
  const iterable = new SQLSourceChunkIterable(ctx, spec, {
    filters: [filter(new ModelFieldGetter<'id', Data, TestModel>('id'), P.equals(id))],
    what: 'model',
  });
  const m = new TestModel({ id, x: 'x' });

  // thing should not be in cache yet
  expect(cache.get(id, spec.storage.db, spec.storage.tablish)).toEqual(null);
  cache.set(id, m, spec.storage.db, spec.storage.tablish);

  const dbResult = await db.read(sql``);

  // Model should not have ended up in the db. If it did that could hide bugs we're testing for
  // as the query would fall back to db and still get a result.
  expect(dbResult.length).toBe(0);

  const allResults = await iterable.gen();
  // Should have been fulfilled directly from cache
  expect(allResults.length).toBe(1);
  expect(allResults[0]).toBe(m);
});

test('does not direct load if possible but the thing is not cached', async () => {
  const id = '2' as SID_of<TestModel>;
  const iterable = new SQLSourceChunkIterable(ctx, spec, {
    filters: [filter(new ModelFieldGetter<'id', Data, TestModel>('id'), P.equals(id))],
    what: 'model',
  });
  const m = new TestModel({ id, x: 'x' });

  // thing should not be in cache
  expect(cache.get(id, spec.storage.db, spec.storage.tablish)).toEqual(null);

  let allResults = await iterable.gen();
  // Thing isn't in cache nor db, no result
  expect(allResults.length).toBe(0);

  data = [m];
  allResults = await iterable.gen();
  expect(allResults.length).toBe(1);
  expect(allResults[0]).toBe(m);
});

test('does not direct load if not possible (but the thing is cached)', async () => {
  const id = '3' as SID_of<TestModel>;
  const m = new TestModel({ id, x: 'x' });

  // thing should be in cache
  cache.set(id, m, spec.storage.db, spec.storage.tablish);
  expect(cache.get(id, spec.storage.db, spec.storage.tablish)).toBe(m);

  let iterable = new SQLSourceChunkIterable(ctx, spec, {
    filters: [],
    what: 'model',
  });
  let results = await iterable.gen();
  // should be 0 -- we kept the db empty
  expect(results.length).toBe(0);

  iterable = new SQLSourceChunkIterable(ctx, spec, {
    filters: [filter(new ModelFieldGetter<'x', Data, TestModel>('x'), P.equals('x'))],
    what: 'model',
  });
  results = await iterable.gen();
  // should be 0 -- we kept the db empty
  expect(results.length).toBe(0);
});
