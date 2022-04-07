import { CodegenFile, CodegenStep } from '@aphro/codegen-api';
import { Node } from '@aphro/schema-api';
export default class GenTypescriptModel extends CodegenStep {
    private schema;
    static accepts(_schema: Node): boolean;
    constructor(schema: Node);
    gen(): CodegenFile;
    private getDataShapeCode;
    private collectImports;
    private getIdFieldImports;
    private getEdgeImports;
    private getFieldCode;
    private getEdgeCode;
    private getFromMethodInvocation;
}
