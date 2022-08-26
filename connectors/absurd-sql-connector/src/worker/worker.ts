// @ts-ignore -- no types
import initSqlJs from '@aphro/sql.js';
// @ts-ignore -- no types
import { SQLiteFS } from '@aphro/absurd-sql';
// @ts-ignore -- no types
import IndexedDBBackend from '@aphro/absurd-sql/dist/indexeddb-backend.js';
import thisPackage from '../pkg.js';
import tracer from '../tracer.js';

/**
 * This is the entrypoint for our web-worker.
 * It starts sqlite and sets up a listener to listen
 * for query events from `connection.ts`.
 */
async function init(data: any) {
  if (data.event !== 'init') {
    console.error('Received non init message. Should be impossible.');
    return;
  }
  self.removeEventListener('message', initWrapper);

  let SQL = await initSqlJs({
    locateFile: (file: string) => {
      return file;
    },
  });
  // let SQL = await initSqlJs({ locateFile: file => '/assets/js/sql.wasm' });
  let sqlFS = new SQLiteFS(SQL.FS, new IndexedDBBackend());
  SQL.register_for_idb(sqlFS);

  SQL.FS.mkdir('/sql');
  SQL.FS.mount(sqlFS, {}, '/sql');

  let db = new SQL.Database(`/sql/${data.dbName}.sqlite`, { filename: true });
  // see https://github.com/trong-orm/trong-orm/discussions/35 for more discussion
  // TODO: use default journal mode instead?
  db.exec(`
    PRAGMA page_size=8192;
    PRAGMA journal_mode=MEMORY;
  `);

  self.addEventListener('message', ({ data }) => {
    tracer.startActiveSpan('worker.receive-message', () => receiveMessage(db, data));
  });

  self.postMessage({
    pkg: thisPackage,
    event: 'ready',
  });
}

const initWrapper = ({ data }: any) => {
  tracer.genStartActiveSpan('worker.init', () => init(data));
};
self.addEventListener('message', initWrapper);

function receiveMessage(db: any, data: any) {
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
          message: (e as any)?.message,
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
}
