// SIGNED-SOURCE: <25fe9c4bf460b1429605e1e93985de05>
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

const InvoiceLineSpec: NodeSpecWithCreate<InvoiceLine, Data> = {
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
        return InvoiceLineSpec;
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
        return InvoiceLineSpec;
      },
      get dest() {
        return InvoiceSpec;
      },
    },
  },
};

export default InvoiceLineSpec;
