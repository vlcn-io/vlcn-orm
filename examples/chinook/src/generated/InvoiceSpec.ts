// SIGNED-SOURCE: <bd76be6443c362c8c5512466ee4ed53e>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import { Context } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { default as CustomerSpec } from "./CustomerSpec.js";
import { default as InvoiceLineSpec } from "./InvoiceLineSpec.js";
import Invoice from "./Invoice.js";
import { Data } from "./Invoice.js";

const spec: NodeSpecWithCreate<Invoice, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data) {
    const existing = ctx.cache.get(data["id"], Invoice.name);
    if (existing) {
      return existing;
    }
    const result = new Invoice(ctx, data);
    ctx.cache.set(data["id"], result);
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
