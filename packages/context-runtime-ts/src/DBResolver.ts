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
  type: 'sql';
  exec(q: SQLQuery): Promise<any[]>;
  destroy(): void;
};

type OtherResolvedDB = {
  type: 'other';
  exec: (query: string, bindings: any[]) => Promise<any[]>;
  destroy(): void;
};
