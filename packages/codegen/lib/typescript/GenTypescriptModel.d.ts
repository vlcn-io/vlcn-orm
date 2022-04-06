import { CodegenFile, CodegenStep } from '@aphro/codegen-api';
import { Node } from '@aphro/schema';
export default class GenTypescriptModel extends CodegenStep {
    private schema;
    static accepts(_schema: Node): boolean;
    constructor(schema: Node);
    gen(): CodegenFile;
    private getDataShapeCode;
    private getImportCode;
    private getFieldCode;
    private getEdgeCode;
    private getSpecCode;
    private getFromMethodInvocation;
}
