// SIGNED-SOURCE: <802ad1db214870245d16ff73d32db53f>
import { Model, Spec } from "@aphro/model-runtime-ts";
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

export const spec: Spec<Data> = {
  createFrom(data: Data) {
    return new User(data);
  },

  storageDescriptor: {
    engine: "postgres",
    db: "example",
    type: "sql",
    tablish: "user",
  },
};
