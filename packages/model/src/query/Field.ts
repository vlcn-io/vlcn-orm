import { IModel } from "../Model.js";

export interface FieldGetter<Tm, Tv> {
  readonly get: (Tm) => Tv;
}

export class ModelFieldGetter<Tk extends keyof Td, Td, Tm extends IModel<Td>>
  implements FieldGetter<Tm, Td[Tk]>
{
  constructor(public readonly fieldName: Tk) {}

  get(model: Tm): Td[Tk] {
    return model._get(this.fieldName);
  }
}
