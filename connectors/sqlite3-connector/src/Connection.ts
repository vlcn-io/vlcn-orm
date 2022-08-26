// @ts-ignore -- @types/sqlite3 is all wrong when it comes to import structure.
import sqlite3 from 'sqlite3';
import { formatters, sql, SQLQuery, SQLResolvedDB } from '@aphro/runtime-ts';
import Mutex from './Mutex';

const Database = sqlite3.Database;

export class Connection {
  private readonly _mutex = new Mutex();

  constructor(private db: any /*Database*/) {}

  /**
   * How can we ensure that no other statements run while we're inside the transaction?
   * - We don't want random non-tx reads to show up
   * - We don't want random non-tx writes
   * - We don't want a new tx starting
   */

  read(sql: SQLQuery): Promise<any> {
    return this.#read(sql);
  }

  #read(sql: SQLQuery, lock: boolean = true): Promise<any> {
    return this.#readImpl(sql, lock ? fn => this._mutex.readLock(fn) : fn => fn());
  }

  #readImpl(sql: SQLQuery, lock: <T>(fn: () => Promise<T>) => Promise<T>) {
    return lock(() => {
      const formatted = sql.format(formatters['sqlite']);
      return new Promise((resolve, reject) => {
        this.db.all(formatted.text, formatted.values, (error: any, rows: any) => {
          if (error != null) {
            reject(error);
          } else {
            resolve(rows);
          }
        });
      });
    });
  }

  write(sql: SQLQuery): Promise<void> {
    return this.#write(sql);
  }

  #write(sql: SQLQuery, lock: boolean = true): Promise<void> {
    return this.#writeImpl(sql, lock ? fn => this._mutex.readLock(fn) : fn => fn());
  }

  #writeImpl(sql: SQLQuery, lock: (fn: () => Promise<void>) => Promise<void>) {
    return lock(() => {
      const formatted = sql.format(formatters['sqlite']);
      return new Promise((resolve, reject) => {
        this.db.run(formatted.text, formatted.values, (error: any) => {
          if (error != null) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    });
  }

  async transact<T>(cb: (conn: SQLResolvedDB) => Promise<T>): Promise<T> {
    return this._mutex.writeLock(async () => {
      await this.#write(sql`BEGIN`, false);
      try {
        const result = await cb(this.#createLocklessConnectionForTransaction());
        await this.#write(sql`COMMIT`, false);
        return result;
      } catch (ex) {
        await this.#write(sql`ROLLBACK`, false);
        throw ex;
      }
    });
  }

  dispose(): void {
    this.db.close();
  }

  #createLocklessConnectionForTransaction() {
    return {
      type: 'sql',
      read: (sql: SQLQuery): Promise<any> => {
        return this.#read(sql, false);
      },
      write: (sql: SQLQuery) => {
        return this.#write(sql, false);
      },
      transact<T>(cb: (conn: SQLResolvedDB) => Promise<T>): Promise<T> {
        throw new Error('Nested transactions are not yet supported for sqlite3 connector.');
      },
      dispose() {
        throw new Error(
          'You should not dispose a connection from within a transaction. Dispose the top level connection object.',
        );
      },
    };
  }
}

export function createConnection(file: string | null): Promise<Connection> {
  return new Promise((resolve, reject) => {
    const db = new Database(file || ':memory:', (e: any) => {
      if (e != null) {
        reject(e);
      } else {
        resolve(new Connection(db));
      }
    });
  });
}
