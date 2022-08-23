// @ts-ignore -- @types/sqlite3 is all wrong when it comes to import structure.
import sqlite3 from 'sqlite3';
import { formatters, sql, SQLQuery, SQLResolvedDB } from '@aphro/runtime-ts';

const Database = sqlite3.Database;

export class Connection {
  private txQueue: Promise<any> = Promise.resolve();

  constructor(private db: any /*Database*/) {}

  /**
   * How can we ensure that no other statements run while we're inside the transaction?
   * - We don't want random non-tx reads to show up
   * - We don't want random non-tx writes
   * - We don't want a new tx starting
   */

  read(sql: SQLQuery): Promise<any> {
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
  }

  write(sql: SQLQuery): Promise<void> {
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
  }

  async transact<T>(cb: (conn: SQLResolvedDB) => Promise<T>): Promise<T> {
    const res = this.txQueue.then(async () => {
      await this.write(sql`BEGIN`);
      try {
        const ret = await cb(this);
        await this.write(sql`COMMIT`);
        return ret;
      } catch (e) {
        await this.write(sql`ROLLBACK`);
        throw e;
      }
    });
    this.txQueue = res.catch(() => {});
    return res;
  }

  dispose(): void {
    this.db.close();
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
