import { CodegenStep } from '@aphro/codegen-api';
import SqlFile from '../SqlFile.js';
import { fieldToPostgresType } from './postgresField.js';
export default class GenPostgresTableSchema extends CodegenStep {
    schema;
    static accepts(schema) {
        return schema.storage.engine === 'postgres';
    }
    constructor(schema) {
        super();
        this.schema = schema;
    }
    gen() {
        return new SqlFile(this.schema.name + '.pg.sql', `CREATE TABLE ${this.schema.name} (
        ${this.getColumnDefinitionsCode()}
        ${this.getPrimaryKeyCode()}
        ${this.getIndexDefinitionsCode()}
      );`);
    }
    getColumnDefinitionsCode() {
        const fields = Object.values(this.schema.fields);
        return fields.map(f => `${f.name} ${fieldToPostgresType(f)}`).join(',\n');
    }
    getPrimaryKeyCode() {
        return '';
    }
    getIndexDefinitionsCode() {
        return '';
    }
}
//# sourceMappingURL=GenPostgresTableSchema.js.map