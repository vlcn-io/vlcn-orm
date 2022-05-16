import { initBackend } from 'absurd-sql/dist/indexeddb-main-thread';

export default function init() {
  let worker = new Worker(new URL('./asql-worker.ts', import.meta.url), { type: 'module' });
  // This is only required because Safari doesn't support nested
  // workers. This installs a handler that will proxy creating web
  // workers through the main thread
  console.log(initBackend);
  // initBackend(worker);
}
