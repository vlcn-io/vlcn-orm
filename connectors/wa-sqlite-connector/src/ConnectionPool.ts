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
    const conn = this.#readConnections[Math.floor(Math.random() * this.#readConnections.length)];
    return conn.read(q);
  }

  write(q: SQLQuery): Promise<void> {
    return this.#writeConnection.write(q);
  }

  async transact<T>(cb: (conn: SQLResolvedDB) => Promise<T>): Promise<T> {
    return this.#writeConnection.transact(cb);
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
