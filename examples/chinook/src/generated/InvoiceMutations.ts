// SIGNED-SOURCE: <dcb0f91649ae9cb7fa930308da59f137>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
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
    return new Mutations(ctx, new CreateMutationBuilder(ctx, spec)).create(
      args
    );
  }
}
