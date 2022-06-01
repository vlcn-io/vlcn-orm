import { Connection } from '@aphro/absurd-sql';
import TodoTable from './generated/Todo.sqlite.sql';
import UserTable from './generated/User.sqlite.sql';

const connection = new Connection();

connection.ready.then(start).catch(e => console.error(e));

async function start() {
  try {
    await Promise.all([connection.exec(TodoTable), connection.exec(UserTable)]);
  } catch (e) {}
}
