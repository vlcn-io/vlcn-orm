// SIGNED-SOURCE: <200232f5e458d6ab28979e02b0c66e2b>
import { Context } from "@aphro/context-runtime-ts";
import { ModelSpec } from "@aphro/model-runtime-ts";
import Todo from "./Todo.js";
import { Data } from "./Todo.js";

const spec: ModelSpec<Todo, Data> = {
  createFrom(ctx: Context, data: Data) {
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
