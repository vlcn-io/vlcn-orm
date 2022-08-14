// SIGNED-SOURCE: <58dce30fc320d6e7713a20f958a37504>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import * as impls from "../DeckToEditorsEdgeMutationsImpl.js";
import { ICreateOrUpdateBuilder } from "@aphro/runtime-ts";
import { Context } from "@aphro/runtime-ts";
import { MutationsBase } from "@aphro/runtime-ts";
import DeckToEditorsEdge from "../DeckToEditorsEdge.js";
import { default as spec } from "./DeckToEditorsEdgeSpec.js";
import { Data } from "./DeckToEditorsEdgeBase.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { Changeset } from "@aphro/runtime-ts";
import Deck from "../Deck.js";
import { Data as DeckData } from "./DeckBase.js";
import User from "../User.js";
import { Data as UserData } from "./UserBase.js";

export type CreateArgs = {
  src: Deck | Changeset<Deck, DeckData>;
  dest: User | Changeset<User, UserData>;
};
class Mutations extends MutationsBase<DeckToEditorsEdge, Data> {
  constructor(
    ctx: Context,
    mutator: ICreateOrUpdateBuilder<DeckToEditorsEdge, Data>,
    private model?: DeckToEditorsEdge
  ) {
    super(ctx, mutator);
  }

  create(args: CreateArgs): this {
    const extraChangesets = impls.createImpl(this.mutator, args);
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
  constructor(private model: DeckToEditorsEdge) {}
}
