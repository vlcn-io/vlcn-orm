// SIGNED-SOURCE: <abde0850b787bf015f4e3a8c95d8372c>
import {
  DerivedQuery,
  QueryFactory,
  modelLoad,
  filter,
  Predicate,
  P,
  ModelFieldGetter,
} from "@aphro/query-runtime-ts";
import { SID_of } from "@strut/sid";
import User, { Data, spec } from "./User.js";
import User from "./User.js";
import { spec as DeckSpec } from "./Deck";
import DeckQuery from "./DeckQuery";

export default class UserQuery extends DerivedQuery<User> {
  static create() {
    return new UserQuery(
      QueryFactory.createSourceQueryFor(spec),
      modelLoad(spec.createFrom)
    );
  }

  static fromId(id: SID_of<User>) {
    return this.create().whereId(P.equals(id));
  }

  whereId(p: Predicate<Data["id"]>) {
    return new UserQuery(
      this,
      filter(new ModelFieldGetter<"id", Data, User>("id"), p)
    );
  }

  whereName(p: Predicate<Data["name"]>) {
    return new UserQuery(
      this,
      filter(new ModelFieldGetter<"name", Data, User>("name"), p)
    );
  }

  whereCreated(p: Predicate<Data["created"]>) {
    return new UserQuery(
      this,
      filter(new ModelFieldGetter<"created", Data, User>("created"), p)
    );
  }

  whereModified(p: Predicate<Data["modified"]>) {
    return new UserQuery(
      this,
      filter(new ModelFieldGetter<"modified", Data, User>("modified"), p)
    );
  }
  queryDecks(): DeckQuery {
    return new DeckQuery(
      QueryFactory.createHopQueryFor(this, spec, DeckSpec),
      modelLoad(DeckSpec.createFrom)
    ).whereOwnerId(P.equals(this.id));
  }
}
