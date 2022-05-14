// SIGNED-SOURCE: <b356548ef23d602c8e0220a18a6497a8>
import { Context } from "@aphro/context-runtime-ts";
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
import { default as spec } from "./UserSpec.js";
import { default as DeckSpec } from "./DeckSpec.js";
import DeckQuery from "./DeckQuery";

export default class UserQuery extends DerivedQuery<User> {
  static create(ctx: Context) {
    return new UserQuery(
      ctx,
      QueryFactory.createSourceQueryFor(ctx, spec),
      modelLoad(ctx, spec.createFrom)
    );
  }

  static fromId(ctx: Context, id: SID_of<User>) {
    return this.create(ctx).whereId(P.equals(id));
  }

  whereId(p: Predicate<Data["id"]>) {
    return new UserQuery(
      this.ctx,
      this,
      filter(new ModelFieldGetter<"id", Data, User>("id"), p)
    );
  }

  whereName(p: Predicate<Data["name"]>) {
    return new UserQuery(
      this.ctx,
      this,
      filter(new ModelFieldGetter<"name", Data, User>("name"), p)
    );
  }

  whereCreated(p: Predicate<Data["created"]>) {
    return new UserQuery(
      this.ctx,
      this,
      filter(new ModelFieldGetter<"created", Data, User>("created"), p)
    );
  }

  whereModified(p: Predicate<Data["modified"]>) {
    return new UserQuery(
      this.ctx,
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
