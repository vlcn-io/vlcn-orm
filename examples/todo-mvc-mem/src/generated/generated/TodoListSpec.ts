// SIGNED-SOURCE: <2d08d216fec7595caa7c139da1fb320a>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { decodeModelData } from "@aphro/runtime-ts";
import { encodeModelData } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { default as TodoSpec } from "./TodoSpec.js";
import TodoList from "../TodoList.js";
import { Data } from "./TodoListBase.js";

const fields = {
  id: {
    encoding: "none",
  },
  filter: {
    encoding: "none",
  },
  editing: {
    encoding: "none",
  },
} as const;
const TodoListSpec: NodeSpecWithCreate<TodoList, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data, raw: boolean = true) {
    const existing = ctx.cache.get(data["id"], "todomvc", "todolist");
    if (existing) {
      return existing;
    }
    if (raw) data = decodeModelData(data, fields);
    const result = new TodoList(ctx, data);
    ctx.cache.set(data["id"], result, "todomvc", "todolist");
    return result;
  },

  primaryKey: "id",

  storage: {
    engine: "memory",
    db: "todomvc",
    type: "memory",
    tablish: "todolist",
  },

  fields,

  outboundEdges: {
    todos: {
      type: "foreignKey",
      sourceField: "id",
      destField: "listId",
      get source() {
        return TodoListSpec;
      },
      get dest() {
        return TodoSpec;
      },
    },
  },
};

export default TodoListSpec;
