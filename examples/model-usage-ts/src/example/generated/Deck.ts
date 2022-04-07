// SIGNED-SOURCE: <214996253c19e30e112826d80eb2e576>
import { Model } from "@aphro/model-runtime-ts";
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
