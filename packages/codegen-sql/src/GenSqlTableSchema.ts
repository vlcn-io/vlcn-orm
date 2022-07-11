import { CodegenFile, CodegenStep } from '@aphro/codegen-api';
import { SchemaEdge, SchemaNode } from '@aphro/schema-api';
import { assertUnreachable } from '@strut/utils';
import SqlFile from './SqlFile.js';
import { sql, formatters, SQLQuery } from '@aphro/sql-ts';

export default class GenSqlTableSchema extends CodegenStep {
  static accepts(schema: SchemaNode | SchemaEdge): boolean {
    return schema.storage.type === 'sql';
  }

  private schema: SchemaNode | SchemaEdge;
  constructor(opts: {
    nodeOrEdge: SchemaNode | SchemaEdge;
    edges: { [key: string]: SchemaEdge };
    dest: string;
  }) {
    super();
    this.schema = opts.nodeOrEdge;
  }

  async gen(): Promise<CodegenFile> {
    let str;
    const engine = this.schema.storage.engine;
    switch (engine) {
      case 'sqlite':
        str = this.getSqliteString();
        break;
      case 'postgres':
        str = this.getPostgresString();
        break;
      case 'memory':
      case 'ephemeral':
        throw new Error(
          engine +
            ' storage does not and should not try to generate SQL table schemas for model ' +
            this.schema.name,
        );
      default:
        assertUnreachable(engine);
    }

    return new SqlFile(
      `${this.schema.name}.${this.schema.storage.engine}.sql`,
      str,
      this.schema.storage.engine,
    );
  }

  private getSqliteString(): string {
    // TODO: go thru index config and apply index constraints
    const columnDefs = Object.values(this.schema.fields).map(field => {
      let ret: SQLQuery;
      switch (field.type) {
        case 'id':
          ret = sql`${sql.ident(field.name)} bigint`;
          break;
        case 'primitive':
          switch (field.subtype) {
            case 'int32':
            case 'uint32':
              ret = sql`${sql.ident(field.name)} int`;
              break;
            case 'int64':
              ret = sql`${sql.ident(field.name)} bigint`;
              break;
            case 'uint64':
              ret = sql`${sql.ident(field.name)} unsinged big int`;
              break;
            case 'float32':
              ret = sql`${sql.ident(field.name)} float`;
              break;
            case 'float64':
              ret = sql`${sql.ident(field.name)} double`;
              break;
            case 'string':
              // TODO: ask user to define len params so we know the type here
              ret = sql`${sql.ident(field.name)} text`;
              break;
            case 'bool':
              ret = sql`${sql.ident(field.name)} boolean`;
              break;
            case 'any':
              ret = sql`${sql.ident(field.name)} any`;
              break;
            case 'null':
              throw new Error(
                `Field ${field.name} for node ${this.schema.name} must have a type other than simply just being null`,
              );
            default:
              assertUnreachable(field.subtype);
          }
          break;
        case 'map':
        case 'array':
          ret = sql`${sql.ident(field.name)} text`;
          break;
        case 'naturalLanguage':
          // TODO: ask user to define len params so we know the type here
          ret = sql`${sql.ident(field.name)} text`;
          break;
        case 'enumeration':
          ret = sql`${sql.ident(field.name)} varchar(255)`;
          break;
        case 'timestamp':
          ret = sql`${sql.ident(field.name)} bigint`;
          break;
        default:
          assertUnreachable(field);
      }

      if (!field.nullable) {
        ret = sql`${ret} NOT NULL`;
      }
      return ret;
    });

    if (this.schema.type === 'node' && this.schema.primaryKey) {
      columnDefs.push(sql`primary key (${sql.ident(this.schema.primaryKey)})`);
    }

    return sql`CREATE TABLE IF NOT EXISTS ${sql.ident(
      this.schema.name.toLocaleLowerCase(),
    )} (${sql.join(columnDefs, ', ')})`.format(formatters[this.schema.storage.engine]).text;
  }

  private getPostgresString(): string {
    const tableName = this.schema.name.toLocaleLowerCase();
    const columnDefs = Object.values(this.schema.fields).map(field => {
      let ret: SQLQuery;
      switch (field.type) {
        case 'id':
          ret = sql`${sql.ident(field.name)} bigint`;
          break;
        case 'primitive':
          switch (field.subtype) {
            case 'int32':
            case 'uint32':
              ret = sql`${sql.ident(field.name)} integer`;
              break;
            case 'int64':
            case 'uint64':
              ret = sql`${sql.ident(field.name)} bigint`;
              break;
            case 'float32':
              ret = sql`${sql.ident(field.name)} real`;
              break;
            case 'float64':
              ret = sql`${sql.ident(field.name)} double precision`;
              break;
            case 'string':
              // TODO: ask user to define len params so we know the type here
              ret = sql`${sql.ident(field.name)} text`;
              break;
            case 'bool':
              ret = sql`${sql.ident(field.name)} boolean`;
              break;
            case 'any':
              ret = sql`${sql.ident(field.name)} text`;
              break;
            case 'null':
              throw new Error(
                `Field ${field.name} for node ${this.schema.name} must have a type other than simply just being null`,
              );
            default:
              assertUnreachable(field.subtype);
          }
        case 'map':
        case 'array':
          ret = sql`${sql.ident(field.name)} text`;
          break;
        case 'naturalLanguage':
          // TODO: ask user to define len params so we know the type here
          ret = sql`${sql.ident(field.name)} text`;
          break;
        case 'enumeration':
          ret = sql`${sql.ident(field.name)} character varying(255)`;
          break;
        case 'timestamp':
          ret = sql`${sql.ident(field.name)} bigint`;
          break;
        default:
          assertUnreachable(field);
      }

      if (!field.nullable) {
        ret = sql`${ret} NOT NULL`;
      }
      return ret;
    });

    if (this.schema.type === 'node' && this.schema.primaryKey) {
      columnDefs.push(
        sql`CONSTRAINT ${sql.ident(tableName + '_pkey')} PRIMARY KEY (${sql.ident(
          this.schema.primaryKey,
        )})`,
      );
    }

    return sql`CREATE TABLE IF NOT EXISTS ${sql.ident(
      this.schema.storage.schema || 'public',
      tableName,
    )} (${sql.join(columnDefs, ', ')})`.format(formatters[this.schema.storage.engine]).text;
  }
}
