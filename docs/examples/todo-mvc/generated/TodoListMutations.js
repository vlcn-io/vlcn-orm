import { MutationsBase } from "@aphro/runtime-ts";
import { default as spec } from "./TodoListSpec.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
// BEGIN-MANUAL-SECTION: [module-level]
// Manual section for any new imports / export / top level things
import { sid } from "@aphro/runtime-ts";
// END-MANUAL-SECTION
class Mutations extends MutationsBase {
    constructor(ctx, mutator) {
        super(ctx, mutator);
    }
    create({}) {
        // BEGIN-MANUAL-SECTION: [create]
        this.mutator.set({
            id: sid('fixme'),
            filter: 'all',
            editing: null,
        });
        // END-MANUAL-SECTION
        return this;
    }
    filter({ filter }) {
        // BEGIN-MANUAL-SECTION: [filter]
        this.mutator.set({
            filter,
        });
        // END-MANUAL-SECTION
        return this;
    }
    edit({ editing }) {
        // BEGIN-MANUAL-SECTION: [edit]
        this.mutator.set({ editing });
        // END-MANUAL-SECTION
        return this;
    }
}
export default class TodoListMutations {
    static create(ctx, args) {
        return new Mutations(ctx, new CreateMutationBuilder(spec)).create(args);
    }
    static filter(model, args) {
        return new Mutations(model.ctx, new UpdateMutationBuilder(spec, model)).filter(args);
    }
    static edit(model, args) {
        return new Mutations(model.ctx, new UpdateMutationBuilder(spec, model)).edit(args);
    }
}
//# sourceMappingURL=TodoListMutations.js.map