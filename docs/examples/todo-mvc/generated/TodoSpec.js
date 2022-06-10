import Todo from "./Todo.js";
const spec = {
    createFrom(ctx, data) {
        const existing = ctx.cache.get(data["id"]);
        if (existing) {
            return existing;
        }
        return new Todo(ctx, data);
    },
    primaryKey: "id",
    storage: {
        engine: "sqlite",
        db: "todomvc",
        type: "sql",
        tablish: "todo",
    },
    outboundEdges: {},
};
export default spec;
//# sourceMappingURL=TodoSpec.js.map