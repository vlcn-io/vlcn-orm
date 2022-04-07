// SIGNED-SOURCE: <c8c56ef078bfcd162a3bd51dfe24d86e>
import { Model } from "@aphro/model-runtime-ts";
import { SID_of } from "@strut/sid";
import ComponentQuery from "./ComponentQuery.js";
import Component from "./Component.js";

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
    return ComponentQuery.fromSlideId(this.id);
  }
}
