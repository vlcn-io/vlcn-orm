// SIGNED-SOURCE: <7ee63db398f8357cfa8da10308b70cf9>
import { Model } from "@aphro/model-runtime-ts";
import { SID_of } from "@strut/sid";
import DeckQuery from "./DeckQuery.js";
import Deck from "./Deck.js";

export type Data = {
  id: SID_of<any>;
  name: string;
  created: number;
  modified: number;
};

export default class User extends Model<Data> {
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

  queryDecks(): DeckQuery {
    return DeckQuery.fromOwnerId(this.id);
  }
}
