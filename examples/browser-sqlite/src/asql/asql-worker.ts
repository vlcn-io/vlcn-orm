import initSqlJs from '@jlongster/sql.js';
import { SQLiteFS } from 'absurd-sql';
import IndexedDBBackend from 'absurd-sql/dist/indexeddb-backend';

async function init() {
  let SQL = await initSqlJs({ locateFile: file => file });
  let sqlFS = new SQLiteFS(SQL.FS, new IndexedDBBackend());
  SQL.register_for_idb(sqlFS);

  SQL.FS.mkdir('/sql');
  SQL.FS.mount(sqlFS, {}, '/sql');

  let db = new SQL.Database('/sql/db.sqlite', { filename: true });
  db.exec(`
    PRAGMA page_size=8192;
    PRAGMA journal_mode=MEMORY;
  `);
  return db;
}

async function runQueries() {
  let db = await init();

  try {
    db.exec('CREATE TABLE kv (key TEXT PRIMARY KEY, value TEXT)');
  } catch (e) {}

  db.exec('BEGIN TRANSACTION');
  let stmt = db.prepare('INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)');
  for (let i = 0; i < 5; i++) {
    stmt.run([i, ((Math.random() * 100) | 0).toString()]);
  }
  stmt.free();
  db.exec('COMMIT');

  stmt = db.prepare(`SELECT SUM(value) FROM kv`);
  stmt.step();
  console.log('Result:', stmt.getAsObject());
  stmt.free();
}

runQueries();
