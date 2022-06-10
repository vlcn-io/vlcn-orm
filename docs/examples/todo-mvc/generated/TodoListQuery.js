import { DerivedQuery } from "@aphro/runtime-ts";
import { QueryFactory } from "@aphro/runtime-ts";
import { modelLoad } from "@aphro/runtime-ts";
import { filter } from "@aphro/runtime-ts";
import { P } from "@aphro/runtime-ts";
import { ModelFieldGetter } from "@aphro/runtime-ts";
import { default as spec } from "./TodoListSpec.js";
import { default as TodoSpec } from "./TodoSpec.js";
import TodoQuery from "./TodoQuery";
export default class TodoListQuery extends DerivedQuery {
    static create(ctx) {
        return new TodoListQuery(ctx, QueryFactory.createSourceQueryFor(ctx, spec), modelLoad(ctx, spec.createFrom));
    }
    static fromId(ctx, id) {
        return this.create(ctx).whereId(P.equals(id));
    }
    whereId(p) {
        return new TodoListQuery(this.ctx, this, filter(new ModelFieldGetter("id"), p));
    }
    whereFilter(p) {
        return new TodoListQuery(this.ctx, this, filter(new ModelFieldGetter("filter"), p));
    }
    whereEditing(p) {
        return new TodoListQuery(this.ctx, this, filter(new ModelFieldGetter("editing"), p));
    }
    queryTodos() {
        return new TodoQuery(this.ctx, QueryFactory.createHopQueryFor(this.ctx, this, spec.outboundEdges.todos), modelLoad(this.ctx, TodoSpec.createFrom));
    }
}
//# sourceMappingURL=TodoListQuery.js.map