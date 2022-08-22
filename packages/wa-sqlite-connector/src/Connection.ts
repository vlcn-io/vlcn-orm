import SQLiteAsyncESMFactory from 'wa-sqlite/dist/wa-sqlite-async.mjs';
import * as SQLite from 'wa-sqlite';
// @ts-ignore
import { IDBBatchAtomicVFS } from 'wa-sqlite/src/examples/IDBBatchAtomicVFS.js';
// import { OriginPrivateFileSystemVFS } from 'wa-sqlite/src/examples/OriginPrivateFileSystemVFS.js';
import { formatters, SQLQuery } from '@aphro/runtime-ts';
import tracer from './trace.js';
import { Span } from '@opentelemetry/api';

class Connection {
  private queue = Promise.resolve();

  constructor(private sqlite: SQLiteAPI, private db: number) {}

  query(sql: SQLQuery): Promise<any> {
    // TODO: unfortunately wa-sqlite has a bug where concurrent writes creates a deadlock.
    // Serialize all queries for the time being to prevent this.
    // TODO: file a bug report and/or fix it.
    const res = this.queue.then(() => {
      return tracer.genStartActiveSpan('connection.query', (span: Span) =>
        this.#queryImpl(span, sql),
      );
    });
    this.queue = res.catch(() => {});
    return res;
  }

  async #queryImpl(span: Span, sql: SQLQuery): Promise<any> {
    const formatted = sql.format(formatters['sqlite']);
    span.setAttribute('query', formatted.text);

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

    // TODO:... would be good to allow more...
    // you'd have to figure out how to re-map to the right type, however.
    if (results.length > 1) {
      throw new Error('We currently only support 1 statement per query.');
    }
    const returning = results[0];
    if (returning == null) return null;

    const objects: Object[] = [];
    for (const row of returning.rows) {
      const o: { [key: string]: any } = {};
      for (let i = 0; i < returning.columns.length; ++i) {
        o[returning.columns[i]] = row[i];
      }
      objects.push(o);
    }

    // Note: convert `results` to objects.
    // also should only allow single statements
    span.setAttribute('rows', objects.length);
    return objects;
  }

  private bind(stmt: number, values: unknown[]) {
    tracer.startActiveSpan('connection.bind', () => {
      for (let i = 0; i < values.length; ++i) {
        const v = values[i];
        this.sqlite.bind(stmt, i + 1, typeof v === 'boolean' ? (v && 1) || 0 : (v as any));
      }
    });
  }

  dispose() {
    this.sqlite.close(this.db);
  }
}

export default async function createConnection(dbName: string): Promise<Connection> {
  const module = await SQLiteAsyncESMFactory({
    locateFile(file: string) {
      return file;
    },
  });
  const sqlite3 = SQLite.Factory(module);
  sqlite3.vfs_register(new IDBBatchAtomicVFS('idb-batch-atomic', { durability: 'relaxed' }));

  const db = await sqlite3.open_v2(
    dbName,
    SQLite.SQLITE_OPEN_CREATE | SQLite.SQLITE_OPEN_READWRITE | SQLite.SQLITE_OPEN_URI,
    'idb-batch-atomic',
  );

  return new Connection(sqlite3, db);
}
