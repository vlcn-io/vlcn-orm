import React from 'react';
import { createRoot } from 'react-dom/client';
import { anonymous, Context, context, bootstrap } from '@aphro/runtime-ts';
import { openDbAndCreateResolver } from '@aphro/wa-sqlite-connector';

import * as domain from './domain/generated/exports';
import sqlFiles from './domain/generated/exports-sql';
import { useLiveResult } from '@aphro/react';
(window as any).domain = domain;

openDbAndCreateResolver('demo')
  .then(resolver => {
    // TODO: framework should take care of viewer creation?
    start(context(anonymous(), resolver));
  })
  .catch(e => console.error(e));

async function start(ctx: Context) {
  (window as any).ctx = ctx;
  const root = createRoot(document.getElementById('app')!);
  await bootstrap.createAutomigrateIfExists(ctx.dbResolver, sqlFiles);

  const appData = await App.fetch(ctx);
  root.render(<App data={appData} />);
}

function App({ data }: { data: Frags<typeof App> }) {
  const users = useLiveResult(data.liveUsers);
  return (
    <ul>
      {users.map(u => (
        <li key={u.id}>{u.email}</li>
      ))}
    </ul>
  );
}

App.fetch = async (ctx: Context) => {
  const liveUsers = await domain.User.queryAll(ctx).genLive();
  return {
    liveUsers,
  };
};
