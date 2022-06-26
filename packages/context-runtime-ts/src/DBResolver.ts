import { StorageEngine } from '@aphro/schema-api';
import { SQLQuery } from '@aphro/sql-ts';
import { SID_of } from '@strut/sid';

export type EngineToResolved = {
  sqlite: SQLResolvedDB;
  postgres: SQLResolvedDB;
  memory: MemoryResolvedDB;
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

export type MemoryResolvedDB = {
  /**
   * Exec the start point of an in-memory query.
   * All further filters are handled by chunk-iterable framework.
   * TODO: blog post on this.
   * @param tablish the table in which the root nodes reside
   * @param roots the nodes that start the query. undefined -> all of
   * a given type. empty [] -> none / empty query.
   */
  query(tablish: string, roots?: SID_of<any>[]): Promise<any[]>;
  dispose(): void;
};
