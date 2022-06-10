// SIGNED-SOURCE: <7c1defcca2279032840baff340f43095>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import { default as s } from "./TodoListSpec.js";
import { P } from "@aphro/runtime-ts";
import { Model } from "@aphro/runtime-ts";
import TodoListQuery from "./TodoListQuery.js";
import TodoQuery from "./TodoQuery.js";
export default class TodoList extends Model {
    spec = s;
    get id() {
        return this.data.id;
    }
    get filter() {
        return this.data.filter;
    }
    get editing() {
        return this.data.editing;
    }
    queryTodos() {
        return TodoQuery.create(this.ctx).whereListId(P.equals(this.id));
    }
    static queryAll(ctx) {
        return TodoListQuery.create(ctx);
    }
}
//# sourceMappingURL=TodoList.js.map