// SIGNED-SOURCE: <80f0c304ac5b28b440135856b18dc591>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import { Context } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import InvoiceLine from "./InvoiceLine.js";
import { Data } from "./InvoiceLine.js";

const spec: NodeSpecWithCreate<InvoiceLine, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data) {
    const existing = ctx.cache.get(data["id"]);
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

  outboundEdges: {},
};

export default spec;
