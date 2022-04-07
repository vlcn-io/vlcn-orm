// SIGNED-SOURCE: <a56cb91be9f38222963f78c081bda31a>
import { DerivedQuery } from "@aphro/query-runtime-ts";
import { QueryFactory } from "@aphro/query-runtime-ts";
import { modelLoad } from "@aphro/query-runtime-ts";
import { filter } from "@aphro/query-runtime-ts";
import { Predicate } from "@aphro/query-runtime-ts";
import { P } from "@aphro/query-runtime-ts";
import { ModelFieldGetter } from "@aphro/query-runtime-ts";
import { SID_of } from "@strut/sid";
import User from "./User.js";
import { Data } from "./User.js";
import { spec } from "./User.js";
import { default as DeckSpec } from "./DeckSpec.js";
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
      QueryFactory.createHopQueryFor(this, spec.outboundEdges.decks),
      modelLoad(DeckSpec.createFrom)
    );
  }
}
