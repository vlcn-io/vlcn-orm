// SIGNED-SOURCE: <b6d3d291707e197af64ebd660be4d8ec>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import { default as s } from "./TodoSpec.js";
import { Model } from "@aphro/runtime-ts";
import TodoQuery from "./TodoQuery.js";
export default class Todo extends Model {
    spec = s;
    get id() {
        return this.data.id;
    }
    get listId() {
        return this.data.listId;
    }
    get text() {
        return this.data.text;
    }
    get created() {
        return this.data.created;
    }
    get modified() {
        return this.data.modified;
    }
    get completed() {
        return this.data.completed;
    }
    static queryAll(ctx) {
        return TodoQuery.create(ctx);
    }
}
//# sourceMappingURL=Todo.js.map