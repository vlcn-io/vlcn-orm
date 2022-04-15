import {
  Changeset,
  CreateChangeset,
  DeleteChangeset,
  UpdateChangeset,
  IModel,
  Model,
  ModelSpec,
} from '@aphro/model-runtime-ts';
import { __internalConfig } from '@aphro/config-runtime-ts';

export interface IMutationBuilder<T extends Object, M extends IModel<T>> {
  toChangeset(): Changeset<M, T>;
}

export interface ICreateOrUpdateBuilder<T extends Object, M extends IModel<T>>
  extends IMutationBuilder<T, M> {
  set(newData: Partial<T>): this;
}

// TODO: and if we want to enable transactions...
abstract class MutationBuilder<T extends Object, M extends IModel<T>>
  implements IMutationBuilder<T, M>
{
  constructor(protected spec: ModelSpec<T, M>, protected data: Partial<T>) {}
  abstract toChangeset(): Changeset<M, T>;
}

abstract class CreateOrUpdateBuilder<T extends Object, M extends IModel<T>> extends MutationBuilder<
  T,
  M
> {
  set(newData: Partial<T>): this {
    this.data = {
      ...this.data,
      ...newData,
    };

    return this;
  }
}

export abstract class CreationMutationBuilder<
  T extends Object,
  M extends IModel<T>,
> extends CreateOrUpdateBuilder<T, M> {
  constructor(spec: ModelSpec<T, M>) {
    super(spec, {});
  }

  toChangeset(): CreateChangeset<M, T> {
    return {
      type: 'create',
      model: this.spec.createFrom(this.data as T),
      updates: this.data,
    };
  }
}

export abstract class UpdateMutationBuilder<
  T extends Object,
  M extends IModel<T>,
> extends CreateOrUpdateBuilder<T, M> {
  constructor(spec: ModelSpec<T, M>, private model: M) {
    super(spec, {});
  }

  toChangeset(): UpdateChangeset<M, T> {
    return {
      type: 'update',
      model: this.model,
      updates: this.data,
    };
  }
}

export class DeleteMutationBuilder<T extends Object, M extends IModel<T>> extends MutationBuilder<
  T,
  M
> {
  constructor(spec: ModelSpec<T, M>, private model: M) {
    super(spec, {});
  }

  toChangeset(): DeleteChangeset<M, T> {
    return {
      type: 'delete',
      model: this.model,
      updates: undefined,
    };
  }
}

// TODO: we'd likely want to split backends out into plugins so we don't have to pull in knex and other deps.
// for a future time.
// ---
// and now it is easier to see Facebook's CTO's argument against introducing the concepts of packages and namespaces.
// It is a lot of extra mental gymnastics on top of writing code -- but those gymnastics make your software
// flexible for the inevitable changes that come in the future. Of course if your philosophy is always YAGNI
// then YAGNI (modules) until you need it. FB made it 18 years not needing them but now they need them across
// the entire 100s of millions of SLOC codebase. So what do?
// export class SQLMutator<T extends Object, M extends IModel<T>> extends MutatorBase<T, M> {
//   protected compileQuery(): { text: string; bindings: any[] } {
//     // Invoke Knex to create an insert or create statement.
//   }
// }

/*
async save(): Promise<M> {
    const query = this.compileQuery();

    await __internalConfig.resolver
      .type(this.spec.storage.type)
      .engine(this.spec.storage.engine)
      .tablish(this.spec.storage.tablish)
      .exec(query.text, query.bindings);

    // TODO: cache layer...
    // update existing models...
    // what about persist log?
    this.spec.createFrom(this.data);
  }
*/
