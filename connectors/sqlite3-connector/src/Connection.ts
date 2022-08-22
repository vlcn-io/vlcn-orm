import { Database } from 'sqlite3';
import { formatters, sql, SQLQuery, SQLResolvedDB } from '@aphro/runtime-ts';

export class Connection {
  constructor(private db: Database) {}

  read(sql: SQLQuery): Promise<any> {
    const formatted = sql.format(formatters['sqlite']);
    return new Promise((resolve, reject) => {
      this.db.all(formatted.text, formatted.values, (error, rows) => {
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
      this.db.run(formatted.text, formatted.values, error => {
        if (error != null) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  async transact<T>(cb: (conn: SQLResolvedDB) => Promise<T>): Promise<T> {
    await this.write(sql`BEGIN`);
    try {
      const ret = await cb(this);
      await this.write(sql`COMMIT`);
      return ret;
    } catch (e) {
      await this.write(sql`ROLLBACK`);
      throw e;
    }
  }

  dispose(): void {
    this.db.close();
  }
}

export function createConnection(file: string | null): Promise<Connection> {
  return new Promise((resolve, reject) => {
    const db = new Database(file || ':memory:', e => {
      if (e != null) {
        reject(e);
      } else {
        resolve(new Connection(db));
      }
    });
  });
}
