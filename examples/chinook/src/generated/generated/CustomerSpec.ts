// SIGNED-SOURCE: <d89c9a80eea4dcbb81956dfc6f784e4f>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { default as EmployeeSpec } from "./EmployeeSpec.js";
import { default as InvoiceSpec } from "./InvoiceSpec.js";
import Customer from "../Customer.js";
import { Data } from "./CustomerBase.js";

const spec: NodeSpecWithCreate<Customer, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data) {
    const existing = ctx.cache.get(data["id"], "chinook", "customer");
    if (existing) {
      return existing;
    }
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

  outboundEdges: {
    supportRep: {
      type: "field",
      sourceField: "supportRepId",
      destField: "id",
      get source() {
        return spec;
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
        return spec;
      },
      get dest() {
        return InvoiceSpec;
      },
    },
  },
};

export default spec;
