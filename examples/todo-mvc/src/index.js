import { Connection } from '@aphro/absurd-sql';

const connection = new Connection();

connection.ready
  .then(() => {
    console.log('connection ready!');
  })
  .catch(e => console.error(e));
