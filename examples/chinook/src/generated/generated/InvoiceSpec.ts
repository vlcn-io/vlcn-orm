// SIGNED-SOURCE: <dad7bab5b369ecd42203787ba46d6644>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { default as CustomerSpec } from "./CustomerSpec.js";
import { default as InvoiceLineSpec } from "./InvoiceLineSpec.js";
import Invoice from "../Invoice.js";
import { Data } from "./InvoiceBase.js";

const spec: NodeSpecWithCreate<Invoice, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data) {
    const existing = ctx.cache.get(data["id"], "chinook", "invoice");
    if (existing) {
      return existing;
    }
    const result = new Invoice(ctx, data);
    ctx.cache.set(data["id"], result, "chinook", "invoice");
    return result;
  },

  primaryKey: "id",

  storage: {
    engine: "sqlite",
    db: "chinook",
    type: "sql",
    tablish: "invoice",
  },

  outboundEdges: {
    customer: {
      type: "field",
      sourceField: "customerId",
      destField: "id",
      get source() {
        return spec;
      },
      get dest() {
        return CustomerSpec;
      },
    },
    lines: {
      type: "foreignKey",
      sourceField: "id",
      destField: "invoiceId",
      get source() {
        return spec;
      },
      get dest() {
        return InvoiceLineSpec;
      },
    },
  },
};

export default spec;
