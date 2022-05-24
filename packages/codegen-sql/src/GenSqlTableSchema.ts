import { CodegenFile, CodegenStep } from '@aphro/codegen-api';
import { Node, StorageEngine } from '@aphro/schema-api';
import { assertUnreachable } from '@strut/utils';
import knex from 'knex';
import SqlFile from './SqlFile.js';

// use knex to generate create table
export default class GenSqlTableSchema extends CodegenStep {
  static accepts(schema: Node): boolean {
    return schema.storage.type === 'sql';
  }

  constructor(private schema: Node) {
    super();
  }

  gen(): CodegenFile {
    const str = this.getSqlString();
    return new SqlFile(
      `${this.schema.name}.${this.schema.storage.engine}.sql`,
      str,
      this.schema.storage.engine,
    );
  }

  private getSqlString(): string {
    const knex = getKnex(this.schema.storage.engine);
    // TODO: go thru index config and apply index constraints
    return knex.schema
      .createTable(this.schema.storage.tablish, table => {
        Object.values(this.schema.fields).forEach(field => {
          switch (field.type) {
            case 'id': {
              const columnBuilder = table.bigInteger(field.name).unsigned();
              if (this.schema.primaryKey === field.name) {
                columnBuilder.primary();
              }
              break;
            }
            case 'primitive':
              switch (field.subtype) {
                case 'int32':
                  table.integer(field.name);
                  break;
                case 'int64':
                  table.bigInteger(field.name);
                  break;
                case 'uint32':
                  table.integer(field.name).unsigned();
                  break;
                case 'uint64':
                  table.bigInteger(field.name).unsigned();
                  break;
                case 'float32':
                  table.float(field.name);
                  break;
                case 'float64':
                  table.double(field.name);
                  break;
                case 'string':
                  // TODO: ask user to define len params so we know the type here
                  table.text(field.name);
                  break;
                case 'bool':
                  table.boolean(field.name);
                  break;
              }
              break;
            case 'map':
            case 'array':
              table.text(field.name);
              break;
            // TODO: ask user to define len params so we know the type here
            case 'naturalLanguage':
              table.string(field.name);
              break;
            case 'enumeration':
              table.string(field.name, 255);
              break;
            case 'currency':
              table.float(field.name);
              break;
            case 'timestamp':
              table.bigInteger(field.name);
              break;
            default:
              assertUnreachable(field);
          }
        });
      })
      .toString();
  }
}

function getKnex(engine: StorageEngine) {
  switch (engine) {
    case 'mysql':
      return knex({ client: 'mysql' });
    case 'postgres':
      return knex({ client: 'pg' });
    case 'sqlite':
      return knex({ client: 'sqlite' });
  }
}
