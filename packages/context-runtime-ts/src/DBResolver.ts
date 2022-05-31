import { StorageEngine, StorageType } from '@aphro/schema-api';

export interface DBResolver {
  type(type: StorageType): TypedDBResolver;
}

export interface TypedDBResolver {
  // TODO: we can scope engines based on type T
  engine(engine: StorageEngine): SpecificTypedDBResolver;
}

export interface SpecificTypedDBResolver {
  db(db: string): ResolvedDB;
}

export type ResolvedDB = {
  // TODO: strongly typed returns
  exec: (query: string, bindings: any[]) => Promise<any[]>;
  destroy(): void;
};
