// SIGNED-SOURCE: <f2ab9e4d5073da84df4f802bfcab61e5>
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
  get id(): SID_of<Slide> {
    return this.data.id;
  }

  get deckId(): SID_of<Deck> {
    return this.data.deckId;
  }

  get order(): number {
    return this.data.order;
  }

  queryComponents(): ComponentQuery {
    return ComponentQuery.create().whereSlideId(P.equals(this.id));
  }
}
