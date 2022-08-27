// SIGNED-SOURCE: <5819d7c00f2168e90da25106cd59392b>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import * as impls from "../AppStateMutationsImpl.js";
import { ICreateOrUpdateBuilder } from "@aphro/runtime-ts";
import { Context } from "@aphro/runtime-ts";
import { MutationsBase } from "@aphro/runtime-ts";
import AppState from "../AppState.js";
import { default as spec } from "./AppStateSpec.js";
import { Data } from "./AppStateBase.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { Changeset } from "@aphro/runtime-ts";
import Identity from "../Identity.js";
import { Data as IdentityData } from "./IdentityBase.js";
import Deck from "../Deck.js";

export type CreateArgs = {
  identity: Identity | Changeset<Identity, IdentityData>;
  openDeckId: SID_of<Deck> | null;
};

export type OpenDeckArgs = { openDeck: SID_of<Deck> };
class Mutations extends MutationsBase<AppState, Data> {
  constructor(
    ctx: Context,
    mutator: ICreateOrUpdateBuilder<AppState, Data>,
    private model?: AppState
  ) {
    super(ctx, mutator);
  }

  create(args: CreateArgs): this {
    const extraChangesets = impls.createImpl(this.mutator, args);
    this.mutator.addExtraChangesets(extraChangesets || undefined);
    return this;
  }

  openDeck(args: OpenDeckArgs): this {
    const extraChangesets = impls.openDeckImpl(this.model!, this.mutator, args);
    this.mutator.addExtraChangesets(extraChangesets || undefined);
    return this;
  }
}

const staticMutations = {
  create(ctx: Context, args: CreateArgs): Mutations {
    return new Mutations(ctx, new CreateMutationBuilder(ctx, spec)).create(
      args
    );
  },
};

export default staticMutations;

export class InstancedMutations {
  constructor(private model: AppState) {}

  openDeck(args: OpenDeckArgs): Mutations {
    return new Mutations(
      this.model.ctx,
      new UpdateMutationBuilder(this.model.ctx, spec, this.model),
      this.model
    ).openDeck(args);
  }
}
