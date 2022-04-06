import { IModel } from '@aphro/model-runtime-ts';
export interface FieldGetter<Tm, Tv> {
    readonly get: (Tm: any) => Tv;
}
export declare class ModelFieldGetter<Tk extends keyof Td, Td, Tm extends IModel<Td>> implements FieldGetter<Tm, Td[Tk]> {
    readonly fieldName: Tk;
    constructor(fieldName: Tk);
    get(model: Tm): Td[Tk];
}
