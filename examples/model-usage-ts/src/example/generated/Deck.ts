// SIGNED-SOURCE: <67286ba7eb0fe202c014144a6ef87aff>
import { Model, Spec } from "@aphro/model-runtime-ts";
import { SID_of } from "@strut/sid";
import UserQuery from "./UserQuery.js";
import SlideQuery from "./SlideQuery.js";
import Slide from "./Slide.js";

export type Data = {
  id: SID_of<any>;
  name: string;
  created: number;
  modified: number;
  ownerId: SID_of<any>;
  selectedSlide: SID_of<any>;
};

export default class Deck extends Model<Data> {
  get id(): SID_of<any> {
    return this.data.id;
  }

  get name(): string {
    return this.data.name;
  }

  get created(): number {
    return this.data.created;
  }

  get modified(): number {
    return this.data.modified;
  }

  get ownerId(): SID_of<any> {
    return this.data.ownerId;
  }

  get selectedSlide(): SID_of<any> {
    return this.data.selectedSlide;
  }

  queryOwner(): UserQuery {
    return UserQuery.fromId(this.ownerId);
  }
  querySlides(): SlideQuery {
    return SlideQuery.fromDeckId(this.id);
  }
}

export const spec: Spec<Data> = {
  createFrom(data: Data) {
    return new Deck(data);
  },

  storageDescriptor: {
    engine: "postgres",
    db: "example",
    type: "sql",
    tablish: "deck",
  },
};
