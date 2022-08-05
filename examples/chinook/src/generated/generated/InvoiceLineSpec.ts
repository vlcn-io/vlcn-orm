// SIGNED-SOURCE: <c8a151f1cb014aa6e6eb4b505421908f>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { decodeModelData } from "@aphro/runtime-ts";
import { encodeModelData } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { default as TrackSpec } from "./TrackSpec.js";
import { default as InvoiceSpec } from "./InvoiceSpec.js";
import InvoiceLine from "../InvoiceLine.js";
import { Data } from "./InvoiceLineBase.js";

const fields = {
  id: {
    encoding: "none",
  },
  invoiceId: {
    encoding: "none",
  },
  trackId: {
    encoding: "none",
  },
  unitPrice: {
    encoding: "none",
  },
  quantity: {
    encoding: "none",
  },
} as const;
const InvoiceLineSpec: NodeSpecWithCreate<InvoiceLine, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data, raw: boolean = true) {
    const existing = ctx.cache.get(data["id"], "chinook", "invoiceline");
    if (existing) {
      return existing;
    }
    if (raw) data = decodeModelData(data, fields);
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

  fields,

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
