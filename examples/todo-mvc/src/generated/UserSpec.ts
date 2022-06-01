// SIGNED-SOURCE: <83ae9530b1a49ef8439c3f22b5ee4879>
import { Context } from "@aphro/runtime-ts";
import { ModelSpec } from "@aphro/runtime-ts";
import { default as TodoSpec } from "./TodoSpec.js";
import User from "./User.js";
import { Data } from "./User.js";

const spec: ModelSpec<User, Data> = {
  createFrom(ctx: Context, data: Data) {
    const existing = ctx.cache.get(data["id"]);
    if (existing) {
      return existing;
    }
    return new User(ctx, data);
  },

  primaryKey: "id",

  storage: {
    engine: "sqlite",
    db: "todomvc",
    type: "sql",
    tablish: "user",
  },

  outboundEdges: {
    todos: {
      type: "foreignKey",
      sourceField: "id",
      destField: "ownerId",
      get source() {
        return spec;
      },
      dest: TodoSpec,
    },
  },
};

export default spec;
