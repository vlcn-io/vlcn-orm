import { DBResolver, basicResolver } from '@aphro/context-runtime-ts';
import { formatters, SQLQuery } from '@aphro/sql-ts';
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
export async function openDbAndCreateResolver(): Promise<DBResolver> {
  const SQL = await initSqlJs({
    locateFile: file => {
      return 'https://esm.sh/@aphro/sql.js/dist/sql-wasm.wasm';
    },
  });

  return basicResolver(new Connection(new SQL.Database()));
}

export class Connection {
  constructor(private db: any) {}

  async query(sql: SQLQuery): Promise<any[]> {
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
