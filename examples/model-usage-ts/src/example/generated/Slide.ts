// SIGNED-SOURCE: <50aab4769fe1aaf2aed9f1a90b9022d3>
import { P } from "@aphro/query-runtime-ts";
import { Model } from "@aphro/model-runtime-ts";
import { SID_of } from "@strut/sid";
import ComponentQuery from "./ComponentQuery.js";
import Component from "./Component.js";
import Deck from "./Deck.js";

export type Data = {
  id: SID_of<Slide>;
  deckId: SID_of<Deck>;
  order: number;
};

export default class Slide extends Model<Data> {
  get id(): SID_of<this> {
    return this.data.id as SID_of<this>;
  }

  get deckId(): SID_of<Deck> {
    return this.data.deckId;
  }

  get order(): number {
    return this.data.order;
  }

  queryComponents(): ComponentQuery {
    return ComponentQuery.create(this.ctx).whereSlideId(P.equals(this.id));
  }
}
