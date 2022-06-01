import { Connection } from '@aphro/absurd-sql';

const connection = new Connection();

console.log(connection);

connection.ready
  .then(() => {
    console.log('connection ready!');
    // create tables
  })
  .catch(e => console.error(e));
