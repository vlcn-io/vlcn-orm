// SIGNED-SOURCE: <76d0f90999fc09d592f28f93c556c0bd>
import { Context } from "@aphro/runtime-ts";
import { DerivedQuery } from "@aphro/runtime-ts";
import { QueryFactory } from "@aphro/runtime-ts";
import { modelLoad } from "@aphro/runtime-ts";
import { filter } from "@aphro/runtime-ts";
import { Predicate } from "@aphro/runtime-ts";
import { P } from "@aphro/runtime-ts";
import { ModelFieldGetter } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import User from "./User.js";
import { Data } from "./User.js";
import { default as spec } from "./UserSpec.js";
import { default as TodoSpec } from "./TodoSpec.js";
import TodoQuery from "./TodoQuery";

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
  queryTodos(): TodoQuery {
    return new TodoQuery(
      this.ctx,
      QueryFactory.createHopQueryFor(this.ctx, this, spec.outboundEdges.todos),
      modelLoad(this.ctx, TodoSpec.createFrom)
    );
  }
}
