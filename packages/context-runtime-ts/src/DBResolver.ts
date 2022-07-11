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
  query(q: SQLQuery): Promise<any[]>;
  dispose(): void;
};

type OtherResolvedDB = {
  type: 'other';
  query: (query: string, bindings: any[]) => Promise<any[]>;
  dispose(): void;
};

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
  query(q: MemoryQuery): Promise<any[]>;
  dispose(): void;
};

export type ThrowsDB = {
  query(q: any): Promise<any>;
  dispose(): void;
};
