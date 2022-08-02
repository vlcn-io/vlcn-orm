import * as React from 'react';
import { createRoot } from 'react-dom/client';

import { anonymous, basicResolver, MemoryDB, sid } from '@aphro/runtime-ts';
import { context, Context } from '@aphro/runtime-ts';
import App from './App.js';
import TodoList from './generated/TodoList.js';

const ctx = context(anonymous(), basicResolver(new MemoryDB()));

// Add some stuff to window for playing around in the console and seeing updates in the UI.
(window as any).TodoList = TodoList;
(window as any).ctx = ctx;
start(ctx);

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

async function start(ctx: Context) {
  const list = await bootstrap(ctx);

  const root = createRoot(document.getElementById('container'));
  root.render(<App list={list} />);
}
