import count from '@strut/counter';
import thisPackage from '../pkg.js';
// @ts-ignore -- no type on imported pkg
import { initBackend } from '@aphro/absurd-sql/dist/indexeddb-main-thread.js';
import { formatters, sql, SQLQuery, SQLResolvedDB } from '@aphro/runtime-ts';
import tracer from '../tracer.js';
import Mutex from './Mutex.js';

let queryId = 0;

const counter = count('@aphro/absurd-sql/Connection');

/**
 * Absurd-sql runs in a web-worker. I.e., outside the main thread of the browser.
 *
 * Given it is in a worker we need a way to pass messages back and forth in order to run queries.
 * That is what this class does.
 *
 * It
 * 1. spawns the web-worker that will run our sqlite database
 * 2. does message passing back and forth between the caller of `Connection` and the `sqlite` worker
 */
export default class Connection {
  #worker: Worker;
  #pending: {
    id: number;
    resolve: (v: any) => void;
    reject: (e: any) => void;
  }[] = [];

  readonly ready: Promise<boolean>;
  // TODO: test this mutex approach vs dedicated tx connection approach taken in other
  // connectors.
  private readonly _mutex = new Mutex();

  constructor(dbName: string) {
    counter.bump('create');
    this.#worker = new Worker(new URL('../worker/worker.js', import.meta.url), { type: 'module' });
    initBackend(this.#worker);

    this.ready = new Promise(resolve => {
      const setReady = ({ data }: any) => {
        const { pkg, event } = data;
        if (pkg !== thisPackage) {
          return;
        }
        if (event !== 'ready') {
          return;
        }
        resolve(true);
        this.#worker.removeEventListener('message', setReady);
      };
      this.#worker.addEventListener('message', setReady);
    });

    this.#worker.postMessage({
      event: 'init',
      dbName,
    });

    this.#worker.addEventListener('message', m => {
      tracer.startActiveSpan('connection.receive-message', () => this.#messageListener(m));
    });
  }

  read(sql: SQLQuery): Promise<any[]> {
    return this.#query(sql);
  }

  write(sql: SQLQuery): Promise<any> {
    return this.#query(sql);
  }

  async transact<T>(cb: (conn: SQLResolvedDB) => Promise<T>): Promise<T> {
    return this._mutex.writeLock(async () => {
      await this.#query(sql`BEGIN`, false);
      try {
        const result = await cb(this.#createLocklessConnectionForTransaction());
        await this.#query(sql`COMMIT`, false);
        return result;
      } catch (ex) {
        await this.#query(sql`ROLLBACK`, false);

        throw ex;
      }
    });
  }

  /**
   * The mutex we hold and create in this class is specifically for ensuring statements unrelated to a
   * transaction do not get inserted into the transaction due to microtasks getting inserted between
   * awaits.
   *
   * As such, we can return a lockloess connection once we're inside of a transaction since, inside the transaction,
   * we hold the lock.
   * @returns
   */
  #createLocklessConnectionForTransaction() {
    return {
      type: 'sql',
      read: (sql: SQLQuery) => {
        return this.#query(sql, false);
      },
      write: (sql: SQLQuery) => {
        return this.#query(sql, false);
      },
      transact<T>(cb: (conn: SQLResolvedDB) => Promise<T>): Promise<T> {
        throw new Error('Nested transactions are not yet supported for absurd-sql.');
      },
      dispose() {
        throw new Error(
          'You should not dispose a connection from within a transaction. Dispose the top level connection object.',
        );
      },
    };
  }

  #query(sql: SQLQuery, acquireLock: boolean = true): Promise<any> {
    return tracer.genStartActiveSpan('connection.query', () => {
      return this.runQuery(sql, acquireLock ? fn => this._mutex.readLock(fn) : fn => fn());
    });
  }

  #messageListener = ({ data }: any) => {
    const { pkg, id, event } = data;
    if (pkg !== thisPackage) {
      return;
    }
    if (event !== 'query-response') {
      return;
    }
    counter.bump('query-response');

    if (id == null) {
      counter.bump('no-id');
      return;
    }

    const index = this.#pending.findIndex(p => p.id === id);
    if (index === -1) {
      counter.bump('no-matching-id');
      return;
    }
    const pending = this.#pending[index];
    this.#pending.splice(index, 1);

    if (data.error) {
      pending.reject(data.error);
    } else {
      pending.resolve(data.result);
    }
  };

  dispose() {
    counter.bump('destroy');
    this.#worker.removeEventListener('message', this.#messageListener);
  }

  private runQuery(sql: SQLQuery, lock: <T>(fn: () => Promise<T>) => Promise<T>) {
    return lock(() => {
      counter.bump('query');
      const id = queryId++;

      let resolvePending: (v: unknown) => void;
      let rejectPending: (reason?: any) => void;
      const promise = new Promise((resolve, reject) => {
        resolvePending = resolve;
        rejectPending = reject;
      });

      this.#pending.push({
        id,
        // @ts-ignore -- assigned in promise construction cb
        resolve: resolvePending,
        // @ts-ignore -- assigned in promise construction cb
        reject: rejectPending,
      });

      const formatted = sql.format(formatters['sqlite']);

      this.#worker.postMessage({
        pkg: thisPackage,
        event: 'query',
        queryObj: { sql: formatted.text, bindings: formatted.values },
        id,
      });

      return promise;
    });
  }
}
