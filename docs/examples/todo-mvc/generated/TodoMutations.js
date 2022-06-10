import { MutationsBase } from "@aphro/runtime-ts";
import { default as spec } from "./TodoSpec.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
// BEGIN-MANUAL-SECTION: [module-level]
import { sid } from "@aphro/runtime-ts";
// END-MANUAL-SECTION
class Mutations extends MutationsBase {
    constructor(ctx, mutator) {
        super(ctx, mutator);
    }
    create({ text, listId }) {
        // BEGIN-MANUAL-SECTION: [create]
        this.mutator.set({
            id: sid('fixme'),
            text,
            listId,
            created: Date.now(),
            modified: Date.now(),
        });
        // END-MANUAL-SECTION
        return this;
    }
    toggleComplete({ completed }) {
        // BEGIN-MANUAL-SECTION: [toggleComplete]
        this.mutator.set({
            completed: completed == null ? Date.now() : null,
        });
        // END-MANUAL-SECTION
        return this;
    }
    setComplete({ completed }) {
        // BEGIN-MANUAL-SECTION: [setComplete]
        this.mutator.set({
            completed,
        });
        // END-MANUAL-SECTION
        return this;
    }
    changeText({ text }) {
        // BEGIN-MANUAL-SECTION: [changeText]
        this.mutator.set({
            text,
        });
        // END-MANUAL-SECTION
        return this;
    }
    delete({}) {
        // BEGIN-MANUAL-SECTION: [delete]
        // END-MANUAL-SECTION
        return this;
    }
}
export default class TodoMutations {
    static create(ctx, args) {
        return new Mutations(ctx, new CreateMutationBuilder(spec)).create(args);
    }
    static toggleComplete(model, args) {
        return new Mutations(model.ctx, new UpdateMutationBuilder(spec, model)).toggleComplete(args);
    }
    static setComplete(model, args) {
        return new Mutations(model.ctx, new UpdateMutationBuilder(spec, model)).setComplete(args);
    }
    static changeText(model, args) {
        return new Mutations(model.ctx, new UpdateMutationBuilder(spec, model)).changeText(args);
    }
    static delete(model, args) {
        return new Mutations(model.ctx, new DeleteMutationBuilder(spec, model)).delete(args);
    }
}
//# sourceMappingURL=TodoMutations.js.map