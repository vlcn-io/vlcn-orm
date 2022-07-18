// SIGNED-SOURCE: <481fb04cb37b4bb0d7864ffc643e5d4b>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import Todo from "./Todo.js";
import { Data } from "./TodoBase.js";

const spec: NodeSpecWithCreate<Todo, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data) {
    const existing = ctx.cache.get(data["id"], "todomvc", "todo");
    if (existing) {
      return existing;
    }
    const result = new Todo(ctx, data);
    ctx.cache.set(data["id"], result, "todomvc", "todo");
    return result;
  },

  primaryKey: "id",

  storage: {
    engine: "memory",
    db: "todomvc",
    type: "memory",
    tablish: "todo",
  },

  outboundEdges: {},
};

export default spec;
