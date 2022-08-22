import { sql, SQLQuery, SQLResolvedDB } from '@aphro/runtime-ts';
import createConnection, { Connection } from './Connection';

class ConnectionPool {
  type = 'sql';
  #writeConnection: Connection;
  #readConnections: Connection[];

  constructor(connections: Connection[]) {
    // sqlite cannot do concurrent writes so set aside one connection
    // to service all writes.
    // all other connections service reads.

    this.#writeConnection = connections[0];
    this.#readConnections = connections.slice(1);
  }

  read(q: SQLQuery): Promise<any[]> {
    // round robin selection
    // TODO: we need to differentiate reads and writes
    throw new Error('not implemented exception');
  }

  write(q: SQLQuery): Promise<void> {
    throw new Error('not implemented');
  }

  async transact<T>(cb: (conn: SQLResolvedDB) => Promise<T>): Promise<T> {
    // pick a connection then do transaction work
    // pick a read or write conn? :|
    // transactional writes are most likely.
    // why need a transactional read?
    throw new Error();
  }

  dispose(): void {}
}

export default async function createPool(dbName: string, size: number): Promise<SQLResolvedDB> {
  if (size < 2) {
    throw new Error('Connection pool must be size 2 or greater');
  }

  const connectons = await Promise.all(
    Array.from({ length: size }).map(_ => createConnection(dbName)),
  );

  return new ConnectionPool(connectons);
}
