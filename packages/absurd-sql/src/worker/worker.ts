import initSqlJs from '@jlongster/sql.js';
import { SQLiteFS } from 'absurd-sql';
import IndexedDBBackend from 'absurd-sql/dist/indexeddb-backend.js';
import thisPackage from '../pkg.js';

async function init() {
  let SQL = await initSqlJs({ locateFile: file => file });
  // let SQL = await initSqlJs({ locateFile: file => '/assets/js/sql.wasm' });
  let sqlFS = new SQLiteFS(SQL.FS, new IndexedDBBackend());
  SQL.register_for_idb(sqlFS);

  SQL.FS.mkdir('/sql');
  SQL.FS.mount(sqlFS, {}, '/sql');

  let db = new SQL.Database('/sql/db.sqlite', { filename: true });
  db.exec(`
    PRAGMA page_size=8192;
    PRAGMA journal_mode=MEMORY;
  `);

  self.addEventListener('message', async function ({ data }) {
    const { pkg, event, id, queryObj } = data;
    if (pkg !== thisPackage) {
      return;
    }
    if (event !== 'query') {
      return;
    }

    if (queryObj.bindings) {
      const stmt = db.prepare(queryObj.sql);
      const rows: any[] = [];
      try {
        stmt.bind(queryObj.bindings);
        while (stmt.step()) rows.push(stmt.get());
      } catch (e) {
        this.self.postMessage({
          pkg: thisPackage,
          event: 'query-response',
          id,
          error: e,
        });
        return;
      } finally {
        stmt.free();
      }

      self.postMessage({
        pkg: thisPackage,
        event: 'query-response',
        id,
        result: rows,
      });
    } else {
      try {
        db.exec(queryObj.sql);
      } catch (e) {
        self.postMessage({
          pkg: thisPackage,
          event: 'query-response',
          id,
          error: e,
        });
      }
    }
  });

  self.postMessage({
    pkg: thisPackage,
    event: 'ready',
  });
}

init();
