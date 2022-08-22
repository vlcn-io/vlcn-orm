import { DBResolver, basicResolver, SQLResolvedDB, sql } from '@aphro/runtime-ts';
import { formatters, SQLQuery } from '@aphro/runtime-ts';
// @ts-ignore
import initSqlJs from '@aphro/sql.js';

/**
 * Convenience function to create a connection to absurd-sql and return
 * a db resolver that resolves to that connection.
 *
 * You should _only_ ever call `createResolver` one time from your application.
 * After calling `createResolver`, attach the provided resolver to `Context` and/or pass
 * your resolver instance around to where it is needed.
 *
 * Only call this once since each call will try to start up a new sqlite instance.
 *
 * @returns DBResolver
 */
export async function openDbAndCreateResolver(db: string, file?: string): Promise<DBResolver> {
  const sqlPromise = initSqlJs({
    locateFile: (file: string) => {
      return 'https://esm.sh/@aphro/sql.js/dist/sql-wasm.wasm';
    },
  });
  let dataPromise: Promise<ArrayBuffer> | null = null;
  if (file != null) {
    dataPromise = fetch(file).then(res => res.arrayBuffer());
  }
  const [SQL, buf] = await Promise.all([sqlPromise, dataPromise]);

  if (buf != null) {
    return basicResolver(db, new Connection(new SQL.Database(new Uint8Array(buf))));
  }
  return basicResolver(db, new Connection(new SQL.Database()));
}

export class Connection {
  constructor(private db: any) {}

  read(sql: SQLQuery): Promise<any[]> {
    return this.#query(sql);
  }

  write(sql: SQLQuery): Promise<any> {
    return this.#query(sql);
  }

  async transact<T>(cb: (conn: SQLResolvedDB) => Promise<T>): Promise<T> {
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

  async #query(sql: SQLQuery): Promise<any[]> {
    const db = this.db;
    const formatted = sql.format(formatters['sqlite']);

    if (formatted.values) {
      let stmt;
      let rows: any[] = [];
      try {
        stmt = db.prepare(formatted.text);
        stmt.bind(formatted.values);
        while (stmt.step()) rows.push(stmt.getAsObject());
      } finally {
        if (stmt != null) {
          stmt.free();
        }
      }

      return rows;
    }

    const ret = db.exec(formatted.text);
    return [ret];
  }

  dispose(): void {
    this.db.close();
  }
}
