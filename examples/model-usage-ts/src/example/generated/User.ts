// SIGNED-SOURCE: <6946b6483ed9ca4781d81809db076c4b>
import { P } from "@aphro/query-runtime-ts";
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

  queryDecks(): DeckQuery {
    return DeckQuery.create(this.ctx).whereOwnerId(P.equals(this.id));
  }
}
