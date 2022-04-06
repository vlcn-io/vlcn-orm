import { CodegenFile, CodegenStep } from '@aphro/codegen-api';
import { Node } from '@aphro/schema';
export default class GenTypescriptQuery extends CodegenStep {
    private schema;
    static accepts(_schema: Node): boolean;
    constructor(schema: Node);
    gen(): CodegenFile;
    private getFilterMethodsCode;
    private getFilterMethodBody;
    private getFromIdMethodCode;
    private getFromInboundFieldEdgeMethodsCode;
    private getFromInboundFieldEdgeMethodCode;
    private getEdgeImports;
    private getIdFieldImports;
    private getHopMethodsCode;
    private getHopMethod;
    private getHopMethodForJunctionLikeEdge;
    private getHopMethodForFieldLikeEdge;
}
