// SIGNED-SOURCE: <45de480af7276bfa5223f7b03c00dee6>
import { P } from "@aphro/query-runtime-ts";
import { Model } from "@aphro/model-runtime-ts";
import { SID_of } from "@strut/sid";
import UserQuery from "./UserQuery.js";
import SlideQuery from "./SlideQuery.js";
import Slide from "./Slide.js";
import User from "./User.js";

export type Data = {
  id: SID_of<Deck>;
  name: string;
  created: number;
  modified: number;
  ownerId: SID_of<User>;
  selectedSlide: SID_of<Slide>;
};

export default class Deck extends Model<Data> {
  get id(): SID_of<Deck> {
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

  get ownerId(): SID_of<User> {
    return this.data.ownerId;
  }

  get selectedSlide(): SID_of<Slide> {
    return this.data.selectedSlide;
  }

  queryOwner(): UserQuery {
    return UserQuery.fromId(this.ownerId);
  }
  querySlides(): SlideQuery {
    return SlideQuery.create().whereDeckId(P.equals(this.id));
  }
}
