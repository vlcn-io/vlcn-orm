import { StorageEngine } from '@aphro/schema-api';
import { SQLQuery } from '@aphro/sql-ts';

export type EngineToResolved = {
  sqlite: SQLResolvedDB;
  postgres: SQLResolvedDB;
};

export interface DBResolver {
  engine<E extends StorageEngine>(engine: E): SpecificTypedDBResolver<EngineToResolved[E]>;
}

export interface SpecificTypedDBResolver<T extends ResolvedDB> {
  db(db: string): T;
}

export type ResolvedDB = SQLResolvedDB | OtherResolvedDB;

type SQLResolvedDB = {
  query(q: SQLQuery): Promise<any[]>;
  dispose(): void;
};

type OtherResolvedDB = {
  type: 'other';
  query: (query: string, bindings: any[]) => Promise<any[]>;
  dispose(): void;
};
