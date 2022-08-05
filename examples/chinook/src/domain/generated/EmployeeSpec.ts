// SIGNED-SOURCE: <4e0b36e9ddd31352c566c9b139ac489f>
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
import Employee from "../Employee.js";
import { Data } from "./EmployeeBase.js";

const fields = {
  id: {
    encoding: "none",
  },
  lastName: {
    encoding: "none",
  },
  firstName: {
    encoding: "none",
  },
  title: {
    encoding: "none",
  },
  reportsToId: {
    encoding: "none",
  },
  birthdate: {
    encoding: "none",
  },
  hiredate: {
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
} as const;
const EmployeeSpec: NodeSpecWithCreate<Employee, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data, raw: boolean = true) {
    const existing = ctx.cache.get(data["id"], "chinook", "employee");
    if (existing) {
      return existing;
    }
    if (raw) data = decodeModelData(data, fields);
    const result = new Employee(ctx, data);
    ctx.cache.set(data["id"], result, "chinook", "employee");
    return result;
  },

  primaryKey: "id",

  storage: {
    engine: "sqlite",
    db: "chinook",
    type: "sql",
    tablish: "employee",
  },

  fields,

  outboundEdges: {
    reportsTo: {
      type: "field",
      sourceField: "reportsToId",
      destField: "id",
      get source() {
        return EmployeeSpec;
      },
      get dest() {
        return EmployeeSpec;
      },
    },
    supports: {
      type: "foreignKey",
      sourceField: "id",
      destField: "supportRepId",
      get source() {
        return EmployeeSpec;
      },
      get dest() {
        return CustomerSpec;
      },
    },
  },
};

export default EmployeeSpec;
