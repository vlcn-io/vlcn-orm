// SIGNED-SOURCE: <54cc13029e7eb0eb50ca7a53b84aeca5>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { default as s } from "./DeckToEditorsEdgeSpec.js";
import { P } from "@aphro/runtime-ts";
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

export default class DeckToEditorsEdge extends Edge<Data> {
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
}
