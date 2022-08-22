import { createHooks } from '@aphro/react';
import { anonymous, basicResolver, MemoryDB, sid } from '@aphro/runtime-ts';
import { context, Context } from '@aphro/runtime-ts';
import TodoList from './generated/TodoList.js';

export const ctx = context(anonymous(), basicResolver('todomvc', new MemoryDB()));
(window as any).TodoList = TodoList;
(window as any).ctx = ctx;

async function bootstrap(ctx: Context): Promise<TodoList> {
  let list = await TodoList.queryAll(ctx).genOnlyValue();
  if (list == null) {
    list = TodoList.create(ctx, {
      id: sid('aaaa'),
      filter: 'all',
      editing: null,
    }).save().optimistic;
  }

  return list;
}

const initialized = bootstrap(ctx).then(() => {
  return ctx;
});

export const { useQuery, useQueryOne, useBind } = createHooks(initialized);
