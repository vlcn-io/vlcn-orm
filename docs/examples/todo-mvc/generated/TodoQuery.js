import { DerivedQuery } from "@aphro/runtime-ts";
import { QueryFactory } from "@aphro/runtime-ts";
import { modelLoad } from "@aphro/runtime-ts";
import { filter } from "@aphro/runtime-ts";
import { P } from "@aphro/runtime-ts";
import { ModelFieldGetter } from "@aphro/runtime-ts";
import { default as spec } from "./TodoSpec.js";
export default class TodoQuery extends DerivedQuery {
    static create(ctx) {
        return new TodoQuery(ctx, QueryFactory.createSourceQueryFor(ctx, spec), modelLoad(ctx, spec.createFrom));
    }
    static fromId(ctx, id) {
        return this.create(ctx).whereId(P.equals(id));
    }
    whereId(p) {
        return new TodoQuery(this.ctx, this, filter(new ModelFieldGetter("id"), p));
    }
    whereListId(p) {
        return new TodoQuery(this.ctx, this, filter(new ModelFieldGetter("listId"), p));
    }
    whereText(p) {
        return new TodoQuery(this.ctx, this, filter(new ModelFieldGetter("text"), p));
    }
    whereCreated(p) {
        return new TodoQuery(this.ctx, this, filter(new ModelFieldGetter("created"), p));
    }
    whereModified(p) {
        return new TodoQuery(this.ctx, this, filter(new ModelFieldGetter("modified"), p));
    }
    whereCompleted(p) {
        return new TodoQuery(this.ctx, this, filter(new ModelFieldGetter("completed"), p));
    }
}
//# sourceMappingURL=TodoQuery.js.map