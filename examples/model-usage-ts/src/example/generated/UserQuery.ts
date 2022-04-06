// SIGNED-SOURCE: <f90b9805d8a768efcc2451130d4644c8>
import { DerivedQuery } from "@strut/model/query/Query.js";
import QueryFactory from "@strut/model/query/QueryFactory.js";
import { modelLoad, filter } from "@strut/model/query/Expression.js";
import { Predicate, default as P } from "@strut/model/query/Predicate.js";
import { ModelFieldGetter } from "@strut/model/query/Field.js";
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
