import { CodegenFile } from '@aphro/codegen-api';
export default class TypescriptFile implements CodegenFile {
    #private;
    readonly name: string;
    constructor(name: string, contents: string);
    get contents(): string;
}
