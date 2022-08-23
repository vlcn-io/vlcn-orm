import { formatters, sql, SQLQuery, SQLResolvedDB } from '@aphro/runtime-ts';

export class Connection {
  constructor(private db: any) {}

  async read(sql: SQLQuery): Promise<any[]> {
    return this.#query(sql);
  }

  async write(sql: SQLQuery): Promise<any> {
    return this.#query(sql);
  }

  async transact<T>(cb: (conn: SQLResolvedDB) => Promise<T>): Promise<T> {
    this.#query(sql`BEGIN`);
    try {
      const ret = await cb(this);
      this.#query(sql`COMMIT`);
      return ret;
    } catch (e) {
      this.#query(sql`ROLLBACK`);
      throw e;
    }
  }

  #query(sql: SQLQuery): any[] {
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

export function createConnection(SQL: any, buf: ArrayBuffer | null) {
  if (buf != null) {
    return new Connection(new SQL.Database(new Uint8Array(buf)));
  } else {
    return new Connection(new SQL.Database());
  }
}
