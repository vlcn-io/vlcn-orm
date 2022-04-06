import { CodegenStep } from '@aphro/codegen-api';
import { fieldToMySqlType } from './mysqlField.js';
import SqlFile from '../SqlFile.js';
export default class GenMySqlTableSchema extends CodegenStep {
    schema;
    static accepts(schema) {
        return schema.storage.engine === 'mysql';
    }
    constructor(schema) {
        super();
        this.schema = schema;
    }
    gen() {
        return new SqlFile(this.schema.name + '.my.sql', `CREATE TABLE ${this.schema.name} (
        ${this.getColumnDefinitionsCode()}
        ${this.getPrimaryKeyCode()}
        ${this.getIndexDefinitionsCode()}
      );`);
    }
    getColumnDefinitionsCode() {
        const fields = Object.values(this.schema.fields);
        return fields.map(f => `${f.name} ${fieldToMySqlType(f)}`).join(',\n');
    }
    getPrimaryKeyCode() {
        return '';
    }
    getIndexDefinitionsCode() {
        return '';
    }
}
//# sourceMappingURL=GenMySQLTableSchema.js.map