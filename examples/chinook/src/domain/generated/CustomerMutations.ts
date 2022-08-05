// SIGNED-SOURCE: <64cfbf5f469f846641c7e4f37292f757>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import * as impls from "../CustomerMutationsImpl.js";
import { ICreateOrUpdateBuilder } from "@aphro/runtime-ts";
import { Context } from "@aphro/runtime-ts";
import { MutationsBase } from "@aphro/runtime-ts";
import Customer from "../Customer.js";
import { default as spec } from "./CustomerSpec.js";
import { Data } from "./CustomerBase.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { Changeset } from "@aphro/runtime-ts";
import Employee from "../Employee.js";
import { Data as EmployeeData } from "./EmployeeBase.js";

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
    return new Mutations(ctx, new CreateMutationBuilder(ctx, spec)).create(
      args
    );
  }
}
