export class Connection {
  constructor(private db: IDBDatabase) {}

  dispose() {
    this.db.close();
  }
}

export default function createConnection(
  dbName: string,
  version: number,
  bootstrapRoutine: (db: IDBDatabase) => void,
): Promise<Connection> {
  const openRequest = window.indexedDB.open(dbName, version);

  openRequest.onupgradeneeded = function (this: IDBOpenDBRequest, e: IDBVersionChangeEvent) {
    const db = this.result;
    bootstrapRoutine(db);
  };

  return new Promise((resolve, reject) => {
    openRequest.onerror = reject;
    openRequest.onsuccess = function (this: IDBRequest<IDBDatabase>, ev: Event) {
      resolve(new Connection(this.result));
    };
  });
}

/**
 * How shall we upgrade?
 *
 * - Require the user to increment the version in their schema
 * - Generate upgrade code?
 *
 * ^-- we only need to create new tables and drop removed ones.
 * ^-- well and create new indices and remove dropped ones
 *
 * ^-- can we introspect the existing db structure?
 * find deltas? create?
 */
