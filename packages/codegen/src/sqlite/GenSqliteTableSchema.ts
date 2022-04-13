import { CodegenFile, CodegenStep } from '@aphro/codegen-api';
import { Field, Node } from '@aphro/schema-api';
import SqlFile from '../SqlFile.js';

// We always generate sqlit table schemas so we can use them for in-memory dbs for integration tests
export default class GenSqliteTableSchema extends CodegenStep {
  static accepts(schema: Node): boolean {
    return schema.storage.type === 'sql';
  }

  constructor(private schema: Node) {
    super();
  }

  gen(): CodegenFile {
    return new SqlFile(
      this.schema.name + '.lite.sql',
      `CREATE TABLE ${this.schema.name} (
        ${this.getColumnDefinitionsCode()}
        ${this.getPrimaryKeyCode()}
        ${this.getIndexDefinitionsCode()}
      );`,
    );
  }

  private getColumnDefinitionsCode(): string {
    const fields = Object.values(this.schema.fields);

    return fields.map(f => `'${f.name}' ${this.type(f)} ${this.decorations(f)}`).join(',\n');
  }

  private getPrimaryKeyCode(): string {
    return '';
  }

  private getIndexDefinitionsCode(): string {
    return '';
  }

  private type(field: Field): string {
    const type = field.type;
    // TODO: we should have an abstraction to convert from
    // Semantic type -> Storage type
    // Thus we don't have to have every semantic case covered for every backend.
    switch (type) {
      case 'id':
        return 'UNSIGNED BIG INT';
      case 'primitive':
        switch (field.subtype) {
          case 'int32':
            return 'INT';
          case 'float32':
            return 'FLOAT';
          case 'float64':
            return 'DOUBLE';
          case 'int64':
            return 'BIGINT';
          case 'uint64':
            return 'UNSIGNED BIG INT';
          case 'uint32':
            return 'UNSIGNED INT';
          case 'string':
            return 'TEXT';
          case 'bool':
            return 'BOOLEAN';
        }
      // encode before storage...
      // this'll be problematic for test environments that expect json, map, array support...
      case 'map':
      case 'array':
        return 'TEXT';
      case 'naturalLanguage':
        // TODO: take length into account
        return 'TEXT';
      case 'enumeration':
        return 'VARCHAR(255)';
      case 'currency':
        return 'FLOAT';
      case 'timestamp':
        return 'DATETIME';
    }
  }

  private decorations(field: Field): string {
    if (field.name === this.schema.primaryKey) {
      return 'PRIMARY KEY';
    }
    return '';
  }
}
