import { sign } from './CodegenFile.js';
import { SQL_TEMPLATE } from '@aphro/codegen-api';
import { format } from 'sql-formatter';
export default class SqlFile {
    name;
    #contents;
    constructor(name, contents) {
        this.name = name;
        this.#contents = contents;
    }
    get contents() {
        return sign(format(this.#contents), SQL_TEMPLATE);
    }
}
//# sourceMappingURL=SqlFile.js.map