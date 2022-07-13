// SIGNED-SOURCE: <7dcfdb47ca2851033bbd522ff1ec5c08>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import * as impls from "./EmployeeMutationsImpl.js";
import { ICreateOrUpdateBuilder } from "@aphro/runtime-ts";
import { Context } from "@aphro/runtime-ts";
import { MutationsBase } from "@aphro/runtime-ts";
import Employee from "./Employee.js";
import { default as spec } from "./EmployeeSpec.js";
import { Data } from "./Employee.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { Changeset } from "@aphro/runtime-ts";
import { Data as EmployeeData } from "./Employee.js";

export type CreateArgs = {
  lastName: string;
  firstName: string;
  title: string | null;
  reportsTo: Employee | Changeset<Employee, EmployeeData> | null;
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
class Mutations extends MutationsBase<Employee, Data> {
  constructor(ctx: Context, mutator: ICreateOrUpdateBuilder<Employee, Data>) {
    super(ctx, mutator);
  }

  create(args: CreateArgs): this {
    const extraChangesets = impls.createImpl(this.mutator, args);
    this.mutator.addExtraChangesets(extraChangesets || undefined);
    return this;
  }
}

export default class EmployeeMutations {
  static create(ctx: Context, args: CreateArgs): Mutations {
    return new Mutations(ctx, new CreateMutationBuilder(ctx, spec)).create(
      args
    );
  }
}
