// SIGNED-SOURCE: <5ff373f34fb708a323f925bf2f38fbce>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import Employee from "../Employee.js";
import { default as s } from "./EmployeeSpec.js";
import { P } from "@aphro/runtime-ts";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { OptimisticPromise } from "@aphro/runtime-ts";
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import EmployeeQuery from "./EmployeeQuery.js";
import { Context } from "@aphro/runtime-ts";
import EmployeeSpec from "./EmployeeSpec.js";
import CustomerQuery from "./CustomerQuery.js";
import Customer from "../Customer.js";

export type Data = {
  id: SID_of<Employee>;
  lastName: string;
  firstName: string;
  title: string | null;
  reportsToId: SID_of<Employee> | null;
  birthdate: number | null;
  hiredate: number | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;
  phone: string | null;
  fax: string | null;
  email: string | null;
};

// @Sealed(Employee)
export default abstract class EmployeeBase extends Node<Data> {
  readonly spec = s as unknown as NodeSpecWithCreate<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as unknown as SID_of<this>;
  }

  get lastName(): string {
    return this.data.lastName;
  }

  get firstName(): string {
    return this.data.firstName;
  }

  get title(): string | null {
    return this.data.title;
  }

  get reportsToId(): SID_of<Employee> | null {
    return this.data.reportsToId;
  }

  get birthdate(): number | null {
    return this.data.birthdate;
  }

  get hiredate(): number | null {
    return this.data.hiredate;
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

  get email(): string | null {
    return this.data.email;
  }

  queryReportsTo(): EmployeeQuery {
    if (this.reportsToId == null) {
      return EmployeeQuery.empty(this.ctx);
    }
    return EmployeeQuery.fromId(this.ctx, this.reportsToId);
  }
  querySupports(): CustomerQuery {
    return CustomerQuery.create(this.ctx).whereSupportRepId(
      P.equals(this.id as any)
    );
  }

  genReportsTo(): OptimisticPromise<Employee | null> {
    const existing = this.ctx.cache.get(
      this.reportsToId,
      EmployeeSpec.storage.db,
      EmployeeSpec.storage.tablish
    );
    if (existing != null) {
      const ret = new OptimisticPromise<Employee | null>((resolve) =>
        resolve(existing)
      );
      ret.__setOptimisticResult(existing);
      return ret;
    }
    return new OptimisticPromise((resolve, reject) =>
      this.queryReportsTo().genOnlyValue().then(resolve, reject)
    );
  }

  static queryAll(ctx: Context): EmployeeQuery {
    return EmployeeQuery.create(ctx);
  }

  static async genx(ctx: Context, id: SID_of<Employee>): Promise<Employee> {
    const existing = ctx.cache.get(id, "chinook", "employee");
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue();
  }

  static async gen(
    ctx: Context,
    id: SID_of<Employee>
  ): Promise<Employee | null> {
    const existing = ctx.cache.get(id, "chinook", "employee");
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genOnlyValue();
  }

  update(data: Partial<Data>) {
    return new UpdateMutationBuilder(this.ctx, this.spec, this)
      .set(data)
      .toChangeset();
  }

  static create(ctx: Context, data: Partial<Data>) {
    return new CreateMutationBuilder(ctx, s).set(data).toChangeset();
  }

  delete() {
    return new DeleteMutationBuilder(this.ctx, this.spec, this).toChangeset();
  }
}
