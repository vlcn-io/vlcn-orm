import { StorageEngine, StorageType } from '@aphro/schema-api';

export interface DBResolver {
  type<T extends StorageType>(type: T): TypedDBResolver<T>;
}

export interface TypedDBResolver<T extends StorageType> {
  engine(engine: StorageEngine): SpecificTypedDBResolver<T>;
}

export interface SpecificTypedDBResolver<T extends StorageType> {
  tablish(tablish: string): DBTypes[T];
}

type DBTypes = {
  sql: SQLDB;
};

interface SQLDB {
  // TODO: can we get better types here?
  // From ModelSpec<T> and the projection of the query?
  // if the projection is known and the spec is known we know what the query returns.
  exec(queryString: string, bindings: any[]): any;
}
