// SIGNED-SOURCE: <f361acfacebdbda4b98b0775cf59fb82>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import * as impls from "./CustomerMutationsImpl.js";
import { ICreateOrUpdateBuilder } from "@aphro/runtime-ts";
import { Context } from "@aphro/runtime-ts";
import { MutationsBase } from "@aphro/runtime-ts";
import Customer from "./Customer.js";
import { default as spec } from "./CustomerSpec.js";
import { Data } from "./Customer.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { Changeset } from "@aphro/runtime-ts";
import Employee from "./Employee.js";
import { Data as EmployeeData } from "./Employee.js";

export type CreateArgs = {
  firstName: string;
  lastName: string;
  email: string;
  supportRep: Employee | Changeset<Employee, EmployeeData>;
};
class Mutations extends MutationsBase<Customer, Data> {
  constructor(ctx: Context, mutator: ICreateOrUpdateBuilder<Customer, Data>) {
    super(ctx, mutator);
  }

  create(args: CreateArgs): this {
    const extraChangesets = impls.createImpl(this.mutator, args);
    this.mutator.addExtraChangesets(extraChangesets || undefined);
    return this;
  }
}

export default class CustomerMutations {
  static create(ctx: Context, args: CreateArgs): Mutations {
    return new Mutations(ctx, new CreateMutationBuilder(spec)).create(args);
  }
}
