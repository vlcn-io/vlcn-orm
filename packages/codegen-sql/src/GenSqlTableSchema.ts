import { CodegenFile, CodegenStep } from '@aphro/codegen-api';
import { Node } from '@aphro/schema-api';
import { assertUnreachable } from '@strut/utils';
import SqlFile from './SqlFile.js';
import { sql, formatters } from '@aphro/sql-ts';

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
    // TODO: go thru index config and apply index constraints
    const columnDefs = Object.values(this.schema.fields).map(field => {
      switch (field.type) {
        case 'id':
          return sql`${sql.ident(field.name)} bigint`;
        case 'primitive':
          switch (field.subtype) {
            case 'int32':
            case 'uint32':
              return sql`${sql.ident(field.name)} int`;
            case 'int64':
              return sql`${sql.ident(field.name)} bigint`;
            case 'uint64':
              return sql`${sql.ident(field.name)} unsinged big int`;
            case 'float32':
              return sql`${sql.ident(field.name)} float`;
            case 'float64':
              return sql`${sql.ident(field.name)} double`;
            case 'string':
              // TODO: ask user to define len params so we know the type here
              return sql`${sql.ident(field.name)} text`;
            case 'bool':
              return sql`${sql.ident(field.name)} boolean`;
          }
        case 'map':
        case 'array':
          return sql`${sql.ident(field.name)} text`;
        case 'naturalLanguage':
          // TODO: ask user to define len params so we know the type here
          return sql`${sql.ident(field.name)} text`;
        case 'enumeration':
          return sql`${sql.ident(field.name)} varchar(255)`;
        case 'currency':
          return sql`${sql.ident(field.name)} float`;
        case 'timestamp':
          return sql`${sql.ident(field.name)} bigint`;
        default:
          assertUnreachable(field);
      }
    });

    if (this.schema.primaryKey) {
      columnDefs.push(sql`primary key (${sql.ident(this.schema.primaryKey)})`);
    }

    return sql`CREATE TABLE ${sql.ident(this.schema.name.toLocaleLowerCase())} (${sql.join(
      columnDefs,
      ', ',
    )})`.format(formatters[this.schema.storage.engine]).text;
  }
}
