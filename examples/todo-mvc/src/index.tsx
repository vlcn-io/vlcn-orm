import React from 'react';
import { createRoot } from 'react-dom/client';

import { Connection } from '@aphro/absurd-sql';
import TodoTable from './generated/Todo.sqlite.sql';
import { asId, Cache, context, viewer, basicResolver, P, Context } from '@aphro/runtime-ts';
import App from './App.js';

const connection = new Connection();
connection.ready
  .then(() => {
    // TODO: framework should take care of viewer creation?
    const ctx = context(viewer(asId('1')), basicResolver(connection), new Cache());
    start(ctx);
  })
  .catch(e => console.error(e));

async function bootstrap(ctx: Context) {
  // TODO: We need some better way to indicate the current state of "bootstrapping"
  // The framework should take care of:
  // 1. Are all tables created?
  // 2. Are all tables up to date with the currently running schema?
  // 3. If not (2), start down the migration path

  try {
    await connection.exec(TodoTable);
  } catch (e) {
    if (e.message.indexOf('already exists') === -1) {
      throw e;
    }
  }
}

async function start(ctx: Context) {
  await bootstrap(ctx);

  const root = createRoot(document.getElementById('container'));

  root.render(<App />);
}
