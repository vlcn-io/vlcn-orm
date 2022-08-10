import count from '@strut/counter';
import thisPackage from '../pkg.js';
// @ts-ignore -- no type on imported pkg
import { initBackend } from '@aphro/absurd-sql/dist/indexeddb-main-thread.js';
import { formatters, SQLQuery } from '@aphro/sql-ts';
import tracer from '../tracer.js';
import { SpanStatusCode } from '@opentelemetry/api';

let queryId = 0;

const counter = count('@aphro/absurd-sql/Connection');

// TODO: how should we handle db locks?
// Throw to user land?
// Place into queue on catch?
// Always queue? -- this'll impact reads that could be parallel
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

  constructor() {
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

    this.#worker.addEventListener('message', m => {
      tracer.startActiveSpan('connection.receive-message', () => this.#messageListener(m));
    });
  }

  query(sql: SQLQuery): Promise<any> {
    return tracer.genStartActiveSpan('connection.query', () => {
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
}
