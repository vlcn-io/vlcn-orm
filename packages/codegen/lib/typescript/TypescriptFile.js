import { sign } from '../CodegenFile.js';
import { ALGOL_TEMPLATE } from '@aphro/codegen-api';
// @ts-ignore
import prettier from 'prettier';
export default class TypescriptFile {
    name;
    #contents;
    constructor(name, contents) {
        this.name = name;
        this.#contents = contents;
    }
    get contents() {
        return sign(prettier.format(this.#contents, { parser: 'typescript' }), ALGOL_TEMPLATE);
    }
}
//# sourceMappingURL=TypescriptFile.js.map