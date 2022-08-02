import SQLiteAsyncESMFactory from 'wa-sqlite/dist/wa-sqlite-async.mjs';
import * as SQLite from 'wa-sqlite';
import { IDBBatchAtomicVFS } from 'wa-sqlite/src/examples/IDBBatchAtomicVFS';
import { formatters, SQLQuery } from '@aphro/sql-ts';

class Connection {
  constructor(private sqlite: SQLiteAPI, private db: number) {}

  async query(sql: SQLQuery): Promise<any> {
    const formatted = sql.format(formatters['sqlite']);
    const results: { columns: string[]; rows: any[] }[] = [];
    const sqlite3 = this.sqlite;
    const db = this.db;

    // Does the generator's finally (in statements) really get run in all cases?
    // https://hacks.mozilla.org/2015/07/es6-in-depth-generators-continued/
    for await (const stmt of sqlite3.statements(db, formatted.text)) {
      const rows: any[] = [];
      const columns = sqlite3.column_names(stmt);
      if (formatted.values) {
        this.bind(stmt, formatted.values);
      }
      while ((await sqlite3.step(stmt)) === SQLite.SQLITE_ROW) {
        const row = sqlite3.row(stmt);
        rows.push(row);
      }
      if (columns.length) {
        results.push({ columns, rows });
      }
    }

    // Note: convert `results` to objects.
    // also should only allow single statements
    return results;
  }

  private bind(stmt: number, values: unknown[]) {
    for (let i = 0; i < values.length; ++i) {
      const v = values[i];
      this.sqlite.bind(stmt, i + 1, typeof v === 'boolean' ? (v && 1) || 0 : (v as any));
    }
  }

  dispose() {
    this.sqlite.close(this.db);
  }
}

export default async function createConnection(): Promise<Connection> {
  const module = await SQLiteAsyncESMFactory({
    locateFile(file) {
      return file;
    },
  });
  const sqlite3 = SQLite.Factory(module);
  sqlite3.vfs_register(new IDBBatchAtomicVFS('idb-batch-atomic', { durability: 'relaxed' }));

  const db = await sqlite3.open_v2(
    'music-store',
    SQLite.SQLITE_OPEN_CREATE | SQLite.SQLITE_OPEN_READWRITE | SQLite.SQLITE_OPEN_URI,
    'idb-batch-atomic',
  );

  return new Connection(sqlite3, db);
}

/*
await sqlite3.exec(db, `SELECT 'Hello, world!'`, (row, columns) => {
    console.log(row);
  });
*/
/*
const stmt = db.prepare("SELECT * FROM track");
while (stmt.step()) {
  console.log(stmt.getAsObject());
}
*/
