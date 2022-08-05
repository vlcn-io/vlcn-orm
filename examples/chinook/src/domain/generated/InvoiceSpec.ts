// SIGNED-SOURCE: <dfa9e49c4a9bf164b3c30ec7e687a1ad>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { decodeModelData } from "@aphro/runtime-ts";
import { encodeModelData } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { default as CustomerSpec } from "./CustomerSpec.js";
import { default as InvoiceLineSpec } from "./InvoiceLineSpec.js";
import Invoice from "../Invoice.js";
import { Data } from "./InvoiceBase.js";

const fields = {
  id: {
    encoding: "none",
  },
  customerId: {
    encoding: "none",
  },
  invoiceDate: {
    encoding: "none",
  },
  billingAddress: {
    encoding: "none",
  },
  billingCity: {
    encoding: "none",
  },
  billingState: {
    encoding: "none",
  },
  billingCountry: {
    encoding: "none",
  },
  billingPostalCode: {
    encoding: "none",
  },
  total: {
    encoding: "none",
  },
} as const;
const InvoiceSpec: NodeSpecWithCreate<Invoice, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data, raw: boolean = true) {
    const existing = ctx.cache.get(data["id"], "chinook", "invoice");
    if (existing) {
      return existing;
    }
    if (raw) data = decodeModelData(data, fields);
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

  fields,

  outboundEdges: {
    customer: {
      type: "field",
      sourceField: "customerId",
      destField: "id",
      get source() {
        return InvoiceSpec;
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
        return InvoiceSpec;
      },
      get dest() {
        return InvoiceLineSpec;
      },
    },
  },
};

export default InvoiceSpec;
