// SIGNED-SOURCE: <ccdab83bf42e234a6905461efc2e098f>
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
    const existing = ctx.cache.get(data["id"], Todo.name);
    if (existing) {
      return existing;
    }
    const result = new Todo(ctx, data);
    ctx.cache.set(data["id"], result);
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
