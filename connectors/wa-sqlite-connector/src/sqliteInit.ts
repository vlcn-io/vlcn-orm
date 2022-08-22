import SQLiteAsyncESMFactory from 'wa-sqlite/dist/wa-sqlite-async.mjs';
import * as SQLite from 'wa-sqlite';
// @ts-ignore
import { IDBBatchAtomicVFS } from 'wa-sqlite/src/examples/IDBBatchAtomicVFS.js';

let api: SQLiteAPI | null = null;
export default async function getSqliteApi(): Promise<SQLiteAPI> {
  if (api != null) {
    return api;
  }

  const module = await SQLiteAsyncESMFactory({
    locateFile(file: string) {
      return file;
    },
  });
  const sqlite3 = SQLite.Factory(module);
  sqlite3.vfs_register(new IDBBatchAtomicVFS('idb-batch-atomic', { durability: 'relaxed' }));

  return sqlite3;
}
