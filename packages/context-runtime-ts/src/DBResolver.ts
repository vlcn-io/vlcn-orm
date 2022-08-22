import { StorageEngine } from '@aphro/schema-api';
import { SQLQuery } from '@aphro/sql-ts';
import { SID_of } from '@strut/sid';
import { IModel } from './INode';

export type EngineToResolved = {
  sqlite: SQLResolvedDB;
  postgres: SQLResolvedDB;
  memory: MemoryResolvedDB;
  // ephermal models should never hit the resolver
  ephemeral: ThrowsDB;
};

export interface DBResolver {
  engine<E extends StorageEngine>(engine: E): SpecificTypedDBResolver<EngineToResolved[E]>;
}

export interface SpecificTypedDBResolver<T extends ResolvedDB> {
  db(db: string): T;
}

export type ResolvedDB = SQLResolvedDB | MemoryResolvedDB;

export type SQLResolvedDB = {
  read(q: SQLQuery): Promise<any[]>;
  write(q: SQLQuery): Promise<void>;
  transact<T>(cb: (conn: SQLResolvedDB) => Promise<T>): Promise<T>;
  dispose(): void;
};

/*
try {
    await db.query(sql`BEGIN`);

    await db.query(sql`COMMIT`);
  } catch (e) {
    await db.query(sql`ROLLBACK`);
    throw {
      cause: e,
      message: 'Failed to commit the migration. Rolling it back. ' + (e as any)?.message,
    };
  }
*/

export type MemoryReadQuery = {
  type: 'read';
  tablish: string;
  // undefined --> all
  // [] --> none
  // [id, ...]  --> specific ids
  roots?: SID_of<any>[];
};

export type MemoryWriteQuery = {
  type: 'write';
  op: 'delete' | 'upsert';
  tablish: string;
  models: IModel<any>[];
};

export type MemoryQuery = MemoryReadQuery | MemoryWriteQuery;

export type MemoryResolvedDB = {
  read(q: MemoryReadQuery): Promise<any[]>;
  write(q: MemoryWriteQuery): Promise<void>;
  transact<T>(cb: (conn: MemoryResolvedDB) => Promise<T>): Promise<T>;
  dispose(): void;
};

export type ThrowsDB = {
  read(q: any): Promise<any[]>;
  write(q: any): Promise<void>;
  transact<T>(cb: (conn: ThrowsDB) => Promise<T>): Promise<T>;
  dispose(): void;
};
