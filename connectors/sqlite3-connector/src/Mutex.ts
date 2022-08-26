// From: https://github.com/ForbesLindesay/atdatabases/blob/f62a1bcb152634259edc912b36c59da33a4899ae/packages/sqlite/src/Mutex.ts

interface Task {
  start: number;
  write: boolean;
  fn: () => Promise<void>;
}
export default class Mutex {
  readonly maxWaitTimeout: number;
  tasks: Task[] = [];
  running = 0;
  runningWrite = false;
  constructor(maxWaitTimeout: number = 100) {
    this.maxWaitTimeout = maxWaitTimeout;
  }
  _taskStart = (runningWrite: boolean) => {
    this.running++;
    this.runningWrite = runningWrite;
  };
  _taskEnd = () => {
    this.running--;
    this.runningWrite = false;
    while (this.tasks.length && !this.tasks[0].write) {
      this._taskStart(false);
      this.tasks.shift()!.fn().then(this._taskEnd, this._taskEnd);
    }
    if (!this.running && this.tasks.length) {
      this._taskStart(true);
      this.tasks.shift()!.fn().then(this._taskEnd, this._taskEnd);
    }
  };
  async readLock<T>(fn: () => Promise<T>): Promise<T> {
    const now = Date.now();
    // TODO: test that we never have to actually wait till timeout
    // also.. doesn't this conditional look wrong?
    // if we're running a write or some write has timed out? Should it not be:
    // if we're running a write or no write has timed out?
    // also -- why this strange boolean on `runningWrite` that doesn't actually represent if we're running a write?
    if (this.runningWrite || this.tasks.some(t => t.write && now - t.start > this.maxWaitTimeout)) {
      return new Promise((resolve, reject) => {
        this.tasks.push({
          start: now,
          write: false,
          fn: async () => {
            try {
              resolve(await fn());
            } catch (ex) {
              reject(ex);
            }
          },
        });
      });
    } else {
      this._taskStart(false);
      try {
        return await fn();
      } finally {
        this._taskEnd();
      }
    }
  }
  async writeLock<T>(fn: () => Promise<T>): Promise<T> {
    if (this.running) {
      return new Promise((resolve, reject) => {
        this.tasks.push({
          start: Date.now(),
          write: true,
          fn: async () => {
            try {
              resolve(await fn());
            } catch (ex) {
              reject(ex);
            }
          },
        });
      });
    } else {
      this._taskStart(true);
      try {
        return await fn();
      } finally {
        this._taskEnd();
      }
    }
  }
}
