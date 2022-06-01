import count from '@strut/counter';
import thisPackage from '../pkg.js';
import { initBackend } from 'absurd-sql/dist/indexeddb-main-thread.js';

let queryId = 0;

const counter = count('@aphro/absurd-sql/Connection');

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
    this.#worker = new Worker(new URL('../worker/worker.js', import.meta.url));
    initBackend(this.#worker);

    this.ready = new Promise(resolve => {
      const setReady = ({ data }) => {
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

    this.#worker.addEventListener('message', this.#messageListener);
  }

  // TODO: what type gets returned?
  async exec(sql: string, bindings?: any[]): Promise<any> {
    counter.bump('query');
    const id = queryId++;

    let resolvePending;
    let rejectPending;
    const promise = new Promise((resolve, reject) => {
      resolvePending = resolve;
      rejectPending = reject;
    });

    this.#pending.push({
      id,
      resolve: resolvePending,
      reject: rejectPending,
    });

    this.#worker.postMessage({ pkg: thisPackage, event: 'query', queryObj: { sql, bindings }, id });

    return await promise;
  }

  #messageListener = ({ data }) => {
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

    // TODO: handle rejection...

    if (data.error) {
      pending.reject(data.error);
    } else {
      pending.resolve(data);
    }
  };

  destroy() {
    counter.bump('destroy');
    this.#worker.removeEventListener('message', this.#messageListener);
  }
}
