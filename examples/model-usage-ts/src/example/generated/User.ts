// SIGNED-SOURCE: <63fcbe1c10196fcd1d16ed12f5bf868a>
import { Model } from "@aphro/model-runtime-ts";
import { SID_of } from "@strut/sid";
import DeckQuery from "./DeckQuery.js";
import Deck from "./Deck.js";

export type Data = {
  id: SID_of<User>;
  name: string;
  created: number;
  modified: number;
};

export default class User extends Model<Data> {
  get id(): SID_of<User> {
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
