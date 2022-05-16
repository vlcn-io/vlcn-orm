// SIGNED-SOURCE: <b56dd708af2ad8644631245097818dae>
import { Context } from "@aphro/context-runtime-ts";
import { ModelSpec } from "@aphro/model-runtime-ts";
import { default as TodoSpec } from "./TodoSpec.js";
import User from "./User.js";
import { Data } from "./User.js";

const spec: ModelSpec<User, Data> = {
  createFrom(ctx: Context, data: Data) {
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
