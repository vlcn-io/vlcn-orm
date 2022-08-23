import { SQLQuery, SQLResolvedDB } from '@aphro/runtime-ts';
import { Connection, createConnection } from './Connection';

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

export default async function createPool(file: string | null): Promise<SQLResolvedDB> {
  const connectons = await Promise.all(Array.from({ length: 3 }).map(_ => createConnection(file)));

  return new ConnectionPool(connectons);
}
