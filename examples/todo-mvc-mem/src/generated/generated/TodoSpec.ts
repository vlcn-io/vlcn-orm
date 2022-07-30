// SIGNED-SOURCE: <e5a2e19a1f6cb664efb34a9c5c355cc3>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { decodeModelData } from "@aphro/runtime-ts";
import { encodeModelData } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import Todo from "../Todo.js";
import { Data } from "./TodoBase.js";

const fields = {
  id: {
    encoding: "none",
  },
  listId: {
    encoding: "none",
  },
  text: {
    encoding: "none",
  },
  completed: {
    encoding: "none",
  },
} as const;
const TodoSpec: NodeSpecWithCreate<Todo, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data, raw: boolean = true) {
    const existing = ctx.cache.get(data["id"], "todomvc", "todo");
    if (existing) {
      return existing;
    }
    if (raw) data = decodeModelData(data, fields);
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

  fields,

  outboundEdges: {},
};

export default TodoSpec;
