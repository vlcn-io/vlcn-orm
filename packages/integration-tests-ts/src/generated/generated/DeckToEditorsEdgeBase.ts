// SIGNED-SOURCE: <1c3435e85e8f5212b4170b0ff019e796>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import DeckToEditorsEdge from "../DeckToEditorsEdge.js";
import { default as s } from "./DeckToEditorsEdgeSpec.js";
import { P } from "@aphro/runtime-ts";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { makeSavable } from "@aphro/runtime-ts";
import { modelGenMemo } from "@aphro/runtime-ts";
import { Edge } from "@aphro/runtime-ts";
import { EdgeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import DeckToEditorsEdgeQuery from "./DeckToEditorsEdgeQuery.js";
import { Context } from "@aphro/runtime-ts";
import Deck from "../Deck.js";
import User from "../User.js";
import DeckToEditorsEdgeMutations from "./DeckToEditorsEdgeMutations.js";

export type Data = {
  id1: SID_of<Deck>;
  id2: SID_of<User>;
};

// @Sealed(DeckToEditorsEdge)
export default abstract class DeckToEditorsEdgeBase extends Edge<Data> {
  readonly spec = s as unknown as EdgeSpecWithCreate<this, Data>;

  static mutations: typeof DeckToEditorsEdgeMutations =
    DeckToEditorsEdgeMutations;

  get id1(): SID_of<Deck> {
    return this.data.id1;
  }

  get id2(): SID_of<User> {
    return this.data.id2;
  }

  get id(): SID_of<this> {
    return (this.data.id1 + "-" + this.data.id2) as SID_of<this>;
  }

  static queryAll(ctx: Context): DeckToEditorsEdgeQuery {
    return DeckToEditorsEdgeQuery.create(ctx);
  }

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
