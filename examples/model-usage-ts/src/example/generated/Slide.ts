// SIGNED-SOURCE: <1f0c1edc052bf0c71b7e7bb1af0db91a>
import { Model } from "@aphro/model-runtime-ts";
import { SID_of } from "@strut/sid";
import ComponentQuery from "./ComponentQuery.js";
import Component from "./Component.js";

export type Data = {
  id: SID_of<any>;
  deckId: SID_of<any>;
  order: number;
};

export default class Slide extends Model<Data> {
  get id(): SID_of<any> {
    return this.data.id;
  }

  get deckId(): SID_of<any> {
    return this.data.deckId;
  }

  get order(): number {
    return this.data.order;
  }

  queryComponents(): ComponentQuery {
    return ComponentQuery.fromSlideId(this.id);
  }
}
