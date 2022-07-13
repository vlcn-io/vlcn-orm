// SIGNED-SOURCE: <f5fd7df6b85418216ce013384495150c>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { applyMixins } from "@aphro/runtime-ts";
import { default as s } from "./DeckToEditorsEdgeSpec.js";
import { P } from "@aphro/runtime-ts";
import {
  ManualMethods,
  manualMethods,
} from "./DeckToEditorsEdgeManualMethods.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { Edge } from "@aphro/runtime-ts";
import { EdgeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import DeckToEditorsEdgeQuery from "./DeckToEditorsEdgeQuery.js";
import { Context } from "@aphro/runtime-ts";
import Deck from "./Deck.js";
import User from "./User.js";

export type Data = {
  id1: SID_of<Deck>;
  id2: SID_of<User>;
};

class DeckToEditorsEdge extends Edge<Data> {
  readonly spec = s as EdgeSpecWithCreate<this, Data>;

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
    return new UpdateMutationBuilder(this.ctx, this.spec, this).set(data);
  }
}

interface DeckToEditorsEdge extends ManualMethods {}
applyMixins(DeckToEditorsEdge, [manualMethods]);
export default DeckToEditorsEdge;
