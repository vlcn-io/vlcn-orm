// SIGNED-SOURCE: <1271eaad0ad5a3105f42133f04ebfd34>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { default as TrackSpec } from "./TrackSpec.js";
import { default as InvoiceSpec } from "./InvoiceSpec.js";
import InvoiceLine from "../InvoiceLine.js";
import { Data } from "./InvoiceLineBase.js";

const spec: NodeSpecWithCreate<InvoiceLine, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data) {
    const existing = ctx.cache.get(data["id"], "chinook", "invoiceline");
    if (existing) {
      return existing;
    }
    const result = new InvoiceLine(ctx, data);
    ctx.cache.set(data["id"], result, "chinook", "invoiceline");
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
    invoice: {
      type: "field",
      sourceField: "invoiceId",
      destField: "id",
      get source() {
        return spec;
      },
      get dest() {
        return InvoiceSpec;
      },
    },
  },
};

export default spec;
