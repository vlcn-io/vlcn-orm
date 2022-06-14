// SIGNED-SOURCE: <d143aa7c20fcb70e4e5f80cfe46d8043>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import { Context } from "@aphro/runtime-ts";
import { ModelSpec } from "@aphro/runtime-ts";
import { default as PlayerSpec } from "./PlayerSpec.js";
import Person from "./Person.js";
import { Data } from "./Person.js";

const spec: ModelSpec<Person, Data> = {
  createFrom(ctx: Context, data: Data) {
    const existing = ctx.cache.get(data["id"]);
    if (existing) {
      return existing;
    }
    const result = new Person(ctx, data);
    ctx.cache.set(data["id"], result);
    return result;
  },

  primaryKey: "id",

  storage: {
    engine: "sqlite",
    db: "monopoly",
    type: "sql",
    tablish: "person",
  },

  outboundEdges: {
    playing: {
      type: "foreignKey",
      sourceField: "id",
      destField: "ownerId",
      get source() {
        return spec;
      },
      get dest() {
        return PlayerSpec;
      },
    },
  },
};

export default spec;
