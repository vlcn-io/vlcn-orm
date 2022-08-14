import {
  INode,
  NodeSpecWithCreate,
  Changeset,
  CreateChangeset,
  UpdateChangeset,
  DeleteChangeset,
  ChangesetOptions,
  IModel,
  ModelSpecWithCreate,
  Context,
  OptimisticPromise,
} from '@aphro/context-runtime-ts';
import { nanoid } from 'nanoid';
import { commit } from './commit.js';

export interface IMutationBuilder<M extends IModel<D>, D extends Object> {
  readonly ctx: Context;

  toChangesets(options?: ChangesetOptions): [Changeset<M, D>, ...Changeset<any, any>[]] & {
    save: () => OptimisticPromise<[M, ...any[]]>;
    save0: () => [M, ...any[]];
  };
  // TODO: remove this once we get mutations generation complete
  // we don't need `set` for `delete`
  set(newData: Partial<D>): this;
  addExtraChangesets(changesets?: Changeset<any, any>[]): this;
}

export interface ICreateOrUpdateBuilder<M extends IModel<D>, D extends Object>
  extends IMutationBuilder<M, D> {
  set(newData: Partial<D>): this;
}

// TODO: and if we want to enable transactions...
abstract class MutationBuilder<M extends IModel<D>, D extends Object>
  implements IMutationBuilder<M, D>
{
  #extraChangesets: Changeset<any, any>[] = [];

  constructor(
    public readonly ctx: Context,
    protected spec: ModelSpecWithCreate<M, D>,
    protected data: Partial<D>,
  ) {}

  toChangesets(): [Changeset<M, D>, ...Changeset<any, any>[]] & {
    save: () => OptimisticPromise<[M, ...any[]]>;
    save0: () => [M, ...any[]];
  } {
    const cs = this.toChangesetImpl();

    const ret = [cs as Changeset<M, D>, ...this.#extraChangesets];
    // @ts-ignore
    ret.save = () => {
      return commit(this.ctx, ret);
    };
    // @ts-ignore
    ret.save0 = () => {
      return commit(this.ctx, ret).optimistic;
    };

    // @ts-ignore
    return ret;
  }

  protected abstract toChangesetImpl(): Omit<Changeset<M, D>, 'save' | 'save0'>;

  set(newData: Partial<D>): this {
    throw new Error('You cannot call `set` when deleting something');
  }

  addExtraChangesets(changesets?: Changeset<any, any>[]): this {
    if (changesets == null) {
      return this;
    }
    changesets.forEach(cs => this.#extraChangesets.push(cs));
    return this;
  }

  /**
   * Models are updated immediately in-memory. A reference to the model
   * is returned for the case of creates.
   *
   * @returns reference to the model
   */
  save(): OptimisticPromise<M[]> {
    return this.toChangesets().save();
  }
}

abstract class CreateOrUpdateBuilder<M extends IModel<D>, D extends Object> extends MutationBuilder<
  M,
  D
> {
  set(newData: Partial<D>): this {
    (Object.entries(newData) as [keyof Partial<D>, any][]).forEach(e => {
      if (e[1] === undefined) {
        delete newData[e[0]];
      }
    });
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
  constructor(ctx: Context, spec: ModelSpecWithCreate<M, D>) {
    super(ctx, spec, {});
  }

  toChangesetImpl(): Omit<CreateChangeset<M, D>, 'save' | 'save0'> {
    let primaryKey: any =
      this.spec.type === 'node'
        ? this.data[this.spec.primaryKey as keyof D]
        : // @ts-ignore
          this.data.id1 + '-' + this.data.id2;

    if (primaryKey == null && this.spec.type === 'node') {
      // set it automagically? I think that is reasonable.
      primaryKey = this.data[this.spec.primaryKey as keyof D] = nanoid() as any;
    }
    return {
      type: 'create',
      updates: this.data,
      spec: this.spec,
      // TODO: this is _not_ guaranteed to be an SID...
      // We either need a validation step to force primary keys to be SIDs
      // or we need to allow non-sids as primary keys
      id: primaryKey,
    };
  }
}

export class UpdateMutationBuilder<
  M extends IModel<D>,
  D extends Object,
> extends CreateOrUpdateBuilder<M, D> {
  constructor(ctx: Context, spec: ModelSpecWithCreate<M, D>, private model: M) {
    super(ctx, spec, {});
  }

  toChangesetImpl(): Omit<UpdateChangeset<M, D>, 'save' | 'save0'> {
    return {
      type: 'update',
      updates: this.data,
      spec: this.spec,
      model: this.model,
      id: this.model.id,
    };
  }
}

export class DeleteMutationBuilder<M extends IModel<D>, D extends Object> extends MutationBuilder<
  M,
  D
> {
  constructor(ctx: Context, spec: ModelSpecWithCreate<M, D>, private model: M) {
    super(ctx, spec, {});
  }

  toChangesetImpl(): Omit<DeleteChangeset<M, D>, 'save' | 'save0'> {
    return {
      type: 'delete',
      model: this.model,
      spec: this.spec,
      id: this.model.id,
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
