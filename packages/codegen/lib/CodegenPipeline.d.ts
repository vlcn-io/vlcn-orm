import { CodegenStep } from '@aphro/codegen-api';
import { Node, Edge } from '@aphro/schema';
declare type Step = {
    new (x: Node | Edge): CodegenStep;
    accepts: (x: Node | Edge) => boolean;
};
export default class CodegenPipleine {
    private readonly steps;
    constructor(steps?: readonly Step[]);
    gen(schemas: (Node | Edge)[], dest: string): Promise<void>;
}
export {};
