// SIGNED-SOURCE: <65c8cfb1a3f3932cf2e59d806ac6bca0>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import { Context } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { default as TrackSpec } from "./TrackSpec.js";
import InvoiceLine from "./InvoiceLine.js";
import { Data } from "./InvoiceLine.js";

const spec: NodeSpecWithCreate<InvoiceLine, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data) {
    const existing = ctx.cache.get(data["id"], InvoiceLine.name);
    if (existing) {
      return existing;
    }
    const result = new InvoiceLine(ctx, data);
    ctx.cache.set(data["id"], result);
    return result;
  },

  primaryKey: "id",

  storage: {
    engine: "sqlite",
    db: "chinook",
    type: "sql",
    tablish: "invoiceline",
  },

  outboundEdges: {
    track: {
      type: "field",
      sourceField: "trackId",
      destField: "id",
      get source() {
        return spec;
      },
      get dest() {
        return TrackSpec;
      },
    },
  },
};

export default spec;
