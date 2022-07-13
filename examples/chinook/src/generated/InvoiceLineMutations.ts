// SIGNED-SOURCE: <d73be2cfe18b948ba47ab2a2eebdb71b>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import * as impls from "./InvoiceLineMutationsImpl.js";
import { ICreateOrUpdateBuilder } from "@aphro/runtime-ts";
import { Context } from "@aphro/runtime-ts";
import { MutationsBase } from "@aphro/runtime-ts";
import InvoiceLine from "./InvoiceLine.js";
import { default as spec } from "./InvoiceLineSpec.js";
import { Data } from "./InvoiceLine.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { Changeset } from "@aphro/runtime-ts";
import Invoice from "./Invoice.js";
import { Data as InvoiceData } from "./Invoice.js";
import Track from "./Track.js";
import { Data as TrackData } from "./Track.js";

export type CreateArgs = {
  invoice: Invoice | Changeset<Invoice, InvoiceData>;
  track: Track | Changeset<Track, TrackData>;
  unitPrice: number;
  quantity: number;
};
class Mutations extends MutationsBase<InvoiceLine, Data> {
  constructor(
    ctx: Context,
    mutator: ICreateOrUpdateBuilder<InvoiceLine, Data>
  ) {
    super(ctx, mutator);
  }

  create(args: CreateArgs): this {
    const extraChangesets = impls.createImpl(this.mutator, args);
    this.mutator.addExtraChangesets(extraChangesets || undefined);
    return this;
  }
}

export default class InvoiceLineMutations {
  static create(ctx: Context, args: CreateArgs): Mutations {
    return new Mutations(ctx, new CreateMutationBuilder(ctx, spec)).create(
      args
    );
  }
}
