import React from 'react';
import { createRoot } from 'react-dom/client';

import { Connection } from '@aphro/absurd-sql';
import TodoTable from './generated/Todo.sqlite.sql';
import TodoListTable from './generated/TodoList.sqlite.sql';
import { asId, Cache, context, viewer, basicResolver, P, Context } from '@aphro/runtime-ts';
import App from './App.js';
import TodoList from './generated/TodoList.js';
import TodoListMutations from './generated/TodoListMutations.js';

const connection = new Connection();
connection.ready
  .then(() => {
    // TODO: framework should take care of viewer creation?
    const ctx = context(viewer(asId('1')), basicResolver(connection), new Cache());
    start(ctx);
  })
  .catch(e => console.error(e));

async function bootstrap(ctx: Context): Promise<TodoList> {
  // TODO: We need some better way to indicate the current state of "bootstrapping"
  // The framework should take care of:
  // 1. Are all tables created?
  // 2. Are all tables up to date with the currently running schema?
  // 3. If not (2), start down the migration path

  const results = await Promise.allSettled([
    connection.exec(TodoListTable),
    connection.exec(TodoTable),
  ]);

  results.forEach(r => {
    if (r.status === 'rejected' && r.reason.message.indexOf('already exists') === -1) {
      throw r.reason;
    }
  });

  const lists = await TodoList.queryAll(ctx).gen();
  let list;
  let _;
  if (lists.length === 0) {
    [_, list] = await TodoListMutations.create(ctx, {}).save();
  } else {
    list = lists[0];
  }

  return list;
}

async function start(ctx: Context) {
  const list = await bootstrap(ctx);

  const root = createRoot(document.getElementById('container'));
  root.render(<App list={list} />);
}
