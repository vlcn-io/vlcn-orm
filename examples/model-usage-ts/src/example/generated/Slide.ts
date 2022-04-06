// SIGNED-SOURCE: <76fa3a06c21851eb7536b2a4a8e2645b>
import { Model, Spec } from "@aphro/model-runtime-ts";
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

export const spec: Spec<Data> = {
  createFrom(data: Data) {
    return new Slide(data);
  },

  storageDescriptor: {
    engine: "postgres",
    db: "example",
    type: "sql",
    tablish: "slide",
  },
};
