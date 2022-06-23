// SIGNED-SOURCE: <613adf3a6cbc6ac40844a925be314332>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import * as impls from "./InvoiceMutationsImpl.js";
import { ICreateOrUpdateBuilder } from "@aphro/runtime-ts";
import { Context } from "@aphro/runtime-ts";
import { MutationsBase } from "@aphro/runtime-ts";
import Invoice from "./Invoice.js";
import { default as spec } from "./InvoiceSpec.js";
import { Data } from "./Invoice.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { Changeset } from "@aphro/runtime-ts";
import Customer from "./Customer.js";
import { Data as CustomerData } from "./Customer.js";

export type CreateArgs = {
  customer: Customer | Changeset<Customer, CustomerData>;
  invoiceDate: number;
  billingAddress: string | null;
  billingCity: string | null;
  billingState: string | null;
  billingCountry: string | null;
  billingPostalCode: string | null;
  total: number;
};
class Mutations extends MutationsBase<Invoice, Data> {
  constructor(ctx: Context, mutator: ICreateOrUpdateBuilder<Invoice, Data>) {
    super(ctx, mutator);
  }

  create(args: CreateArgs): this {
    const extraChangesets = impls.createImpl(this.mutator, args);
    this.mutator.addExtraChangesets(extraChangesets || undefined);
    return this;
  }
}

export default class InvoiceMutations {
  static create(ctx: Context, args: CreateArgs): Mutations {
    return new Mutations(ctx, new CreateMutationBuilder(spec)).create(args);
  }
}
