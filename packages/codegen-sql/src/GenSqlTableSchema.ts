import { CodegenFile, CodegenStep } from '@aphro/codegen-api';
import { Node } from '@aphro/schema-api';
import { assertUnreachable } from '@strut/utils';
import SqlFile from './SqlFile.js';
import { sql } from '@aphro/sql-ts';

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
    const create = sql`CREATE TABLE ${'T'} (${'LQ'})`;
    // TODO: go thru index config and apply index constraints
    const columnDefs = Object.values(this.schema.fields).map(field => {
      switch (field.type) {
        case 'id':
          return sql`${'C'} ${'t'}`(field.name, 'bigint');
        case 'primitive':
          switch (field.subtype) {
            case 'int32':
            case 'uint32':
              return sql`${'C'} ${'t'}`(field.name, 'int');
            case 'int64':
              return sql`${'C'} ${'t'}`(field.name, 'bigint');
            case 'uint64':
              return sql`${'C'} ${'t'}`(field.name, 'unsigned big int');
            case 'float32':
              return sql`${'C'} ${'t'}`(field.name, 'float');
            case 'float64':
              return sql`${'C'} ${'t'}`(field.name, 'double');
            case 'string':
              // TODO: ask user to define len params so we know the type here
              return sql`${'C'} ${'t'}`(field.name, 'text');
            case 'bool':
              return sql`${'C'} ${'t'}`(field.name, 'boolean');
          }
        case 'map':
        case 'array':
          return sql`${'C'} ${'t'}`(field.name, 'text');
        // TODO: ask user to define len params so we know the type here
        case 'naturalLanguage':
          return sql`${'C'} ${'t'}`(field.name, 'text');
        case 'enumeration':
          return sql`${'C'} ${'t'}`(field.name, 'varchar(255)');
        case 'currency':
          return sql`${'C'} ${'t'}`(field.name, 'float');
        case 'timestamp':
          return sql`${'C'} ${'t'}`(field.name, 'bigint');
        default:
          assertUnreachable(field);
      }
    });

    return create(this.schema.name.toLowerCase(), columnDefs).toString(
      this.schema.storage.engine,
    )[0];
  }
}
