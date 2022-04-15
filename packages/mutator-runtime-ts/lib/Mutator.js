// TODO: and if we want to enable transactions...
class MutationBuilder {
    spec;
    data;
    constructor(spec, data) {
        this.spec = spec;
        this.data = data;
    }
}
class CreateOrUpdateBuilder extends MutationBuilder {
    set(newData) {
        this.data = {
            ...this.data,
            ...newData,
        };
        return this;
    }
}
export class CreationMutationBuilder extends CreateOrUpdateBuilder {
    constructor(spec) {
        super(spec, {});
    }
    getChangeset() {
        // TODO -- refactor to remove `model` from `CreateChangeset`
        // @ts-ignore
        return {
            type: 'create',
            updates: this.data,
        };
    }
}
export class UpdateMutationBuilder extends CreateOrUpdateBuilder {
    model;
    constructor(spec, model) {
        super(spec, {});
        this.model = model;
    }
    getChangeset() {
        return {
            type: 'update',
            model: this.model,
            updates: this.data,
        };
    }
}
export class DeleteMutationBuilder extends MutationBuilder {
    model;
    constructor(spec, model) {
        super(spec, {});
        this.model = model;
    }
    getChangeset() {
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
//# sourceMappingURL=Mutator.js.map