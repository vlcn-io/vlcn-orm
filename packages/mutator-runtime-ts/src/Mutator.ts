import { IModel, ModelSpec } from '@aphro/model-runtime-ts';
import { __internalConfig } from '@aphro/context-runtime-ts';
import {
  Changeset,
  CreateChangeset,
  UpdateChangeset,
  DeleteChangeset,
  ChangesetOptions,
} from './Changeset.js';

export interface IMutationBuilder<M extends IModel<D>, D extends Object> {
  toChangeset(options?: ChangesetOptions): Changeset<M, D>;
}

export interface ICreateOrUpdateBuilder<M extends IModel<D>, D extends Object>
  extends IMutationBuilder<M, D> {
  set(newData: Partial<D>): this;
}

// TODO: and if we want to enable transactions...
abstract class MutationBuilder<M extends IModel<D>, D extends Object>
  implements IMutationBuilder<M, D>
{
  constructor(protected spec: ModelSpec<M, D>, protected data: Partial<D>) {}
  abstract toChangeset(): Changeset<M, D>;
}

abstract class CreateOrUpdateBuilder<M extends IModel<D>, D extends Object> extends MutationBuilder<
  M,
  D
> {
  set(newData: Partial<D>): this {
    this.data = {
      ...this.data,
      ...newData,
    };

    return this;
  }
}

export class CreateMutationBuilder<
  M extends IModel<D>,
  D extends Object,
> extends CreateOrUpdateBuilder<M, D> {
  constructor(spec: ModelSpec<M, D>) {
    super(spec, {});
  }

  toChangeset(): CreateChangeset<M, D> {
    return {
      type: 'create',
      updates: this.data,
      spec: this.spec,
    };
  }
}

export class UpdateMutationBuilder<
  M extends IModel<D>,
  D extends Object,
> extends CreateOrUpdateBuilder<M, D> {
  constructor(spec: ModelSpec<M, D>, private model: M) {
    super(spec, {});
  }

  toChangeset(): UpdateChangeset<M, D> {
    return {
      type: 'update',
      updates: this.data,
      spec: this.spec,
    };
  }
}

export class DeleteMutationBuilder<M extends IModel<D>, D extends Object> extends MutationBuilder<
  M,
  D
> {
  constructor(spec: ModelSpec<M, D>, private model: M) {
    super(spec, {});
  }

  toChangeset(): DeleteChangeset<M, D> {
    return {
      type: 'delete',
      model: this.model,
      spec: this.spec,
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
