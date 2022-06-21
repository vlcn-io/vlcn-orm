// SIGNED-SOURCE: <3629e1b20605074882918579af93ffbf>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import { default as s } from "./CustomerSpec.js";
import { P } from "@aphro/runtime-ts";
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import CustomerQuery from "./CustomerQuery.js";
import { Context } from "@aphro/runtime-ts";
import EmployeeQuery from "./EmployeeQuery.js";
import InvoiceQuery from "./InvoiceQuery.js";
import Invoice from "./Invoice.js";
import Employee from "./Employee.js";

export type Data = {
  id: SID_of<Customer>;
  firstName: string;
  lastName: string;
  company: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;
  phone: string | null;
  fax: string | null;
  email: string;
  supportRepId: SID_of<Employee>;
};

export default class Customer extends Node<Data> {
  readonly spec = s as NodeSpecWithCreate<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as SID_of<this>;
  }

  get firstName(): string {
    return this.data.firstName;
  }

  get lastName(): string {
    return this.data.lastName;
  }

  get company(): string | null {
    return this.data.company;
  }

  get address(): string | null {
    return this.data.address;
  }

  get city(): string | null {
    return this.data.city;
  }

  get state(): string | null {
    return this.data.state;
  }

  get country(): string | null {
    return this.data.country;
  }

  get postalCode(): string | null {
    return this.data.postalCode;
  }

  get phone(): string | null {
    return this.data.phone;
  }

  get fax(): string | null {
    return this.data.fax;
  }

  get email(): string {
    return this.data.email;
  }

  get supportRepId(): SID_of<Employee> {
    return this.data.supportRepId;
  }

  querySupportRep(): EmployeeQuery {
    return EmployeeQuery.fromId(this.ctx, this.supportRepId);
  }
  queryInvoices(): InvoiceQuery {
    return InvoiceQuery.create(this.ctx).whereCustomerId(P.equals(this.id));
  }

  static queryAll(ctx: Context): CustomerQuery {
    return CustomerQuery.create(ctx);
  }

  static async genx(ctx: Context, id: SID_of<Customer>): Promise<Customer> {
    const existing = ctx.cache.get(id);
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue();
  }

  static async gen(
    ctx: Context,
    id: SID_of<Customer>
  ): Promise<Customer | null> {
    const existing = ctx.cache.get(id);
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genOnlyValue();
  }
}
