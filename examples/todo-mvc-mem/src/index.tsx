import * as React from 'react';
import { createRoot } from 'react-dom/client';

import { anonymous, basicResolver, MemoryDB, sql } from '@aphro/runtime-ts';
import { context, Context } from '@aphro/runtime-ts';
import App from './App.js';
import TodoList from './generated/TodoList.js';
import TodoListMutations from './generated/TodoListMutations.js';

const ctx = context(anonymous(), basicResolver(new MemoryDB()));
start(ctx);

async function bootstrap(ctx: Context): Promise<TodoList> {
  let list = await TodoList.queryAll(ctx).genOnlyValue();
  if (list == null) {
    list = TodoListMutations.create(ctx, {}).save().optimistic;
  }

  return list;
}

async function start(ctx: Context) {
  const list = await bootstrap(ctx);

  const root = createRoot(document.getElementById('container'));
  root.render(<App list={list} />);
}
