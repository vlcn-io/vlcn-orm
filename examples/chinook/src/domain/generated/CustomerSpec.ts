// SIGNED-SOURCE: <c9ed595a2487967f0ae14ab124a07ea7>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { decodeModelData } from "@aphro/runtime-ts";
import { encodeModelData } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { default as EmployeeSpec } from "./EmployeeSpec.js";
import { default as InvoiceSpec } from "./InvoiceSpec.js";
import Customer from "../Customer.js";
import { Data } from "./CustomerBase.js";

const fields = {
  id: {
    encoding: "none",
  },
  firstName: {
    encoding: "none",
  },
  lastName: {
    encoding: "none",
  },
  company: {
    encoding: "none",
  },
  address: {
    encoding: "none",
  },
  city: {
    encoding: "none",
  },
  state: {
    encoding: "none",
  },
  country: {
    encoding: "none",
  },
  postalCode: {
    encoding: "none",
  },
  phone: {
    encoding: "none",
  },
  fax: {
    encoding: "none",
  },
  email: {
    encoding: "none",
  },
  supportRepId: {
    encoding: "none",
  },
} as const;
const CustomerSpec: NodeSpecWithCreate<Customer, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data, raw: boolean = true) {
    const existing = ctx.cache.get(data["id"], "chinook", "customer");
    if (existing) {
      return existing;
    }
    if (raw) data = decodeModelData(data, fields);
    const result = new Customer(ctx, data);
    ctx.cache.set(data["id"], result, "chinook", "customer");
    return result;
  },

  primaryKey: "id",

  storage: {
    engine: "sqlite",
    db: "chinook",
    type: "sql",
    tablish: "customer",
  },

  fields,

  outboundEdges: {
    supportRep: {
      type: "field",
      sourceField: "supportRepId",
      destField: "id",
      get source() {
        return CustomerSpec;
      },
      get dest() {
        return EmployeeSpec;
      },
    },
    invoices: {
      type: "foreignKey",
      sourceField: "id",
      destField: "customerId",
      get source() {
        return CustomerSpec;
      },
      get dest() {
        return InvoiceSpec;
      },
    },
  },
};

export default CustomerSpec;
