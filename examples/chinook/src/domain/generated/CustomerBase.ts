// SIGNED-SOURCE: <c82af10fd8ae9e22ffedd6776bc3be07>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import Customer from "../Customer.js";
import { default as s } from "./CustomerSpec.js";
import { P } from "@aphro/runtime-ts";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { makeSavable } from "@aphro/runtime-ts";
import { modelGenMemo } from "@aphro/runtime-ts";
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import CustomerQuery from "./CustomerQuery.js";
import { Context } from "@aphro/runtime-ts";
import EmployeeQuery from "./EmployeeQuery.js";
import EmployeeSpec from "./EmployeeSpec.js";
import InvoiceQuery from "./InvoiceQuery.js";
import Invoice from "../Invoice.js";
import Employee from "../Employee.js";

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

// @Sealed(Customer)
export default abstract class CustomerBase extends Node<Data> {
  readonly spec = s as unknown as NodeSpecWithCreate<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as unknown as SID_of<this>;
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
    return InvoiceQuery.create(this.ctx).whereCustomerId(
      P.equals(this.id as any)
    );
  }

  async genSupportRep(): Promise<Employee> {
    const existing = this.ctx.cache.get(
      this.supportRepId,
      EmployeeSpec.storage.db,
      EmployeeSpec.storage.tablish
    );
    if (existing != null) {
      return existing;
    }
    return await this.querySupportRep().genxOnlyValue();
  }

  static queryAll(ctx: Context): CustomerQuery {
    return CustomerQuery.create(ctx);
  }

  static genx = modelGenMemo(
    "chinook",
    "customer",
    (ctx: Context, id: SID_of<Customer>): Promise<Customer> =>
      this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue()
  );

  static gen = modelGenMemo<Customer | null>(
    "chinook",
    "customer",
    // @ts-ignore #43
    (ctx: Context, id: SID_of<Customer>): Promise<Customer | null> =>
      this.queryAll(ctx).whereId(P.equals(id)).genOnlyValue()
  );

  update(data: Partial<Data>) {
    return makeSavable(
      this.ctx,
      new UpdateMutationBuilder(this.ctx, this.spec, this)
        .set(data)
        .toChangesets()[0]
    );
  }

  static create(ctx: Context, data: Partial<Data>) {
    return makeSavable(
      ctx,
      new CreateMutationBuilder(ctx, s).set(data).toChangesets()[0]
    );
  }

  delete() {
    return makeSavable(
      this.ctx,
      new DeleteMutationBuilder(this.ctx, this.spec, this).toChangesets()[0]
    );
  }
}
