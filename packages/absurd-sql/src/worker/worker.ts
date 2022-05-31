import initSqlJs from '@jlongster/sql.js';
import { SQLiteFS } from 'absurd-sql';
import IndexedDBBackend from 'absurd-sql/dist/indexeddb-backend';
import thisPackage from '../pkg';

async function init() {
  let SQL = await initSqlJs({ locateFile: file => file });
  // let SQL = await initSqlJs({ locateFile: file => '/assets/js/sql.wasm' });
  let sqlFS = new SQLiteFS(SQL.FS, new IndexedDBBackend());
  SQL.register_for_idb(sqlFS);

  SQL.FS.mkdir('/sql');
  SQL.FS.mount(sqlFS, {}, '/sql');

  const path = '/sql/db.sqlite';
  if (typeof SharedArrayBuffer === 'undefined') {
    let stream = SQL.FS.open(path, 'a+');
    await stream.node.contents.readIfFallback();
    SQL.FS.close(stream);
  }

  let db = new SQL.Database(path, { filename: true });
  db.exec(`
    PRAGMA page_size=8192;
    PRAGMA journal_mode=MEMORY;
  `);

  // Receive and execute queries.
  self.addEventListener('message', async function ({ data }) {
    const { pkg, event, id, queryObj } = data;

    // const stmt = db.prepare(queryObj.sql);
    // stmt.bind(queryObj.bindings);

    // self.postMessage({
    //   pkg: thisPackage,
    //   event: 'query-response',
    //   id,
    //   result: await db.exec(query),
    // });
  });

  self.postMessage({
    pkg: thisPackage,
    event: 'ready',
  });
}

init();
