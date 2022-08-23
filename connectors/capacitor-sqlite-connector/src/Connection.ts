import { formatters, sql, SQLQuery, SQLResolvedDB } from '@aphro/runtime-ts';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite';

class Connection {
  constructor(private db: SQLiteObject) {}

  read(sql: SQLQuery): Promise<any> {
    return this.#query(sql);
  }

  write(sql: SQLQuery): Promise<any> {
    return this.#query(sql);
  }

  #query(sql: SQLQuery): Promise<any> {
    const formatted = sql.format(formatters['sqlite']);
    return this.db.executeSql(formatted.text, formatted.values);
  }

  async transact<T>(cb: (conn: SQLResolvedDB) => Promise<T>): Promise<T> {
    // TODO: this technically does not work since users can interleave statements in ticks of the event loop
    // We need to grab a mutex:
    // https://github.com/ForbesLindesay/atdatabases/blob/master/packages/sqlite/src/index.ts#L119-L120
    await this.#query(sql`BEGIN`);
    try {
      const ret = await cb(this);
      await this.#query(sql`COMMIT`);
      return ret;
    } catch (e) {
      await this.#query(sql`ROLLBACK`);
      throw e;
    }
  }

  dispose() {
    this.db.close();
  }
}

export default async function createConnection(dbName: string, location: string | null) {
  const db = await SQLite.create({
    name: dbName,
    location,
  });

  return new Connection(db);
}
