import { Connection } from '@aphro/absurd-sql';
import TodoTable from './generated/Todo.sqlite.sql';
import UserTable from './generated/User.sqlite.sql';

import User from './generated/User.js';

const connection = new Connection();

connection.ready.then(start).catch(e => console.error(e));

async function bootstrap() {
  // User.queryAll()
  await Promise.allSettled([connection.exec(TodoTable), connection.exec(UserTable)]);
}

async function start() {
  await bootstrap();
}
