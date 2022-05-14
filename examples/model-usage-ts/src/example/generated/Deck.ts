// SIGNED-SOURCE: <c8b16f929a66e250bb3a490d4d954768>
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
  selectedSlideId: SID_of<Slide>;
};

export default class Deck extends Model<Data> {
  get id(): SID_of<this> {
    return this.data.id as SID_of<this>;
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

  get selectedSlideId(): SID_of<Slide> {
    return this.data.selectedSlideId;
  }

  queryOwner(): UserQuery {
    return UserQuery.fromId(this.ownerId);
  }
  querySlides(): SlideQuery {
    return SlideQuery.create().whereDeckId(P.equals(this.id));
  }
  querySelectedSlide(): SlideQuery {
    return SlideQuery.fromId(this.selectedSlideId);
  }
}
