import { StorageEngine, StorageType } from '@aphro/schema-api';
import { Knex } from 'knex';

export interface DBResolver {
  type<T extends StorageType>(type: T): TypedDBResolver<T>;
}

export interface TypedDBResolver<T extends StorageType> {
  // TODO: we can scope engines based on type T
  engine(engine: StorageEngine): SpecificTypedDBResolver<T>;
}

export interface SpecificTypedDBResolver<T extends StorageType> {
  db(db: string): DBTypes[T];
}

// TODO: the client should be able to configure what db types they'd like to supply
// resolvers for
export type DBTypes = {
  sql: Knex;
};
