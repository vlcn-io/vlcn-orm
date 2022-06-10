import { default as TodoSpec } from "./TodoSpec.js";
import TodoList from "./TodoList.js";
const spec = {
    createFrom(ctx, data) {
        const existing = ctx.cache.get(data["id"]);
        if (existing) {
            return existing;
        }
        return new TodoList(ctx, data);
    },
    primaryKey: "id",
    storage: {
        engine: "sqlite",
        db: "todomvc",
        type: "sql",
        tablish: "todolist",
    },
    outboundEdges: {
        todos: {
            type: "foreignKey",
            sourceField: "id",
            destField: "listId",
            get source() {
                return spec;
            },
            dest: TodoSpec,
        },
    },
};
export default spec;
//# sourceMappingURL=TodoListSpec.js.map