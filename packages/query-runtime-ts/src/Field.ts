import { IModel, INode } from '@aphro/context-runtime-ts';

export interface FieldGetter<Tm, Tv> {
  readonly get: (m: Tm) => Tv;
}

/**
 * Don't be confused by `ModelFieldGetter`
 * You may see `model._get(fieldName)` and assume that we're not doing filters
 * in the database but instead loading the model into the application before filtering it.
 *
 * This is not the case. ModelFieldGetters are optimized away into SQL statements whenever possible.
 * They have logic to fetch data from the model in the rare case they can not be optimized (e.g., the user
 * filters based on arbitrary logic and not based on an expression supported in SQL).
 *
 * Read more about query optimization here: https://tantaman.com/2022-05-26-query-plan-optimization.html
 */
export class ModelFieldGetter<Tk extends keyof Td, Td extends {}, Tm extends IModel<Td>>
  implements FieldGetter<Tm, Td[Tk]>
{
  constructor(public readonly fieldName: Tk) {}

  get(model: Tm): Td[Tk] {
    return model._get(this.fieldName);
  }
}
