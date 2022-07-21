import initSqlJs from '@aphro/sql.js';
import { SQLiteFS } from '@aphro/absurd-sql';
import IndexedDBBackend from '@aphro/absurd-sql/dist/indexeddb-backend.js';
import thisPackage from '../pkg.js';

/**
 * This is the entrypoint for our web-worker.
 * It starts sqlite and sets up a listener to listen
 * for query events from `connection.ts`.
 */
async function init() {
  let SQL = await initSqlJs({
    locateFile: file => {
      return file;
    },
  });
  // let SQL = await initSqlJs({ locateFile: file => '/assets/js/sql.wasm' });
  let sqlFS = new SQLiteFS(SQL.FS, new IndexedDBBackend());
  SQL.register_for_idb(sqlFS);

  SQL.FS.mkdir('/sql');
  SQL.FS.mount(sqlFS, {}, '/sql');

  let db = new SQL.Database('/sql/db.sqlite', { filename: true });
  // see https://github.com/trong-orm/trong-orm/discussions/35 for more discussion
  // TODO: use default journal mode instead?
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

    // console.log(queryObj);
    if (queryObj.bindings) {
      let stmt;
      let rows: any[] = [];
      try {
        stmt = db.prepare(queryObj.sql);
        stmt.bind(queryObj.bindings);
        while (stmt.step()) rows.push(stmt.getAsObject());
      } catch (e) {
        self.postMessage({
          pkg: thisPackage,
          event: 'query-response',
          id,
          error: {
            message: e.message,
          },
        });
        return;
      } finally {
        if (stmt != null) {
          stmt.free();
        }
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
        return;
      }

      self.postMessage({
        pkg: thisPackage,
        event: 'query-response',
        id,
        result: [],
      });
    }
  });

  self.postMessage({
    pkg: thisPackage,
    event: 'ready',
  });
}

init();
