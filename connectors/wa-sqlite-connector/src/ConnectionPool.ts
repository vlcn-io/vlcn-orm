import { sql, SQLQuery, SQLResolvedDB } from '@aphro/runtime-ts';
import createConnection, { Connection } from './Connection.js';

// we should remove the connection pool for wa-sqlite
// could be useful in other environments, however.
// https://github.com/rhashimoto/wa-sqlite/discussions/52
class ConnectionPool {
  type = 'sql';
  #writeConnection: Connection;
  #txConnection: Connection;
  #readConnections: Connection[];

  constructor(connections: Connection[]) {
    this.#writeConnection = connections[0];
    this.#txConnection = connections[1];
    this.#readConnections = connections.slice(2);
  }

  read(q: SQLQuery): Promise<any[]> {
    const conn = this.#readConnections[Math.floor(Math.random() * this.#readConnections.length)];
    return conn.read(q);
  }

  write(q: SQLQuery): Promise<void> {
    return this.#writeConnection.write(q);
  }

  async transact<T>(cb: (conn: SQLResolvedDB) => Promise<T>): Promise<T> {
    return this.#txConnection.transact(cb);
  }

  dispose(): void {
    this.#writeConnection.dispose();
    this.#txConnection.dispose();
    this.#readConnections.forEach(rc => rc.dispose());
  }
}

// We create a pool so we can have a dedicated thread for transactions
// rather than implementing and managing mutexes in JS
export default async function createPool(dbName: string): Promise<SQLResolvedDB> {
  const connectons = await Promise.all(
    Array.from({ length: 3 }).map(_ => createConnection(dbName)),
  );

  return new ConnectionPool(connectons);
}
