// SIGNED-SOURCE: <c22d5088fd848329d6f21b5f2b557708>
import { Context } from "@aphro/runtime-ts";
import { ModelSpec } from "@aphro/runtime-ts";
import Todo from "./Todo.js";
import { Data } from "./Todo.js";

const spec: ModelSpec<Todo, Data> = {
  createFrom(ctx: Context, data: Data) {
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
