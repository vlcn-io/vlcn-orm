// SIGNED-SOURCE: <707fe5b86dabae6b540a833ccb58aa7b>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import User from "../User.js";
import { default as s } from "./UserSpec.js";
import { P } from "@aphro/runtime-ts";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { modelGenMemo } from "@aphro/runtime-ts";
import { OptimisticPromise } from "@aphro/runtime-ts";
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import UserQuery from "./UserQuery.js";
import { Context } from "@aphro/runtime-ts";
import DeckQuery from "./DeckQuery.js";
import Deck from "../Deck.js";

export type Data = {
  id: SID_of<User>;
  name: string;
  created: number;
  modified: number;
};

// @Sealed(User)
export default abstract class UserBase extends Node<Data> {
  readonly spec = s as unknown as NodeSpecWithCreate<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as unknown as SID_of<this>;
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
    return DeckQuery.create(this.ctx).whereOwnerId(P.equals(this.id as any));
  }

  static queryAll(ctx: Context): UserQuery {
    return UserQuery.create(ctx);
  }

  static genx = modelGenMemo(
    "example",
    "user",
    (ctx: Context, id: SID_of<User>): OptimisticPromise<User> =>
      new OptimisticPromise((resolve, reject) =>
        this.queryAll(ctx)
          .whereId(P.equals(id))
          .genxOnlyValue()
          .then(resolve, reject)
      )
  );

  static gen = modelGenMemo(
    "example",
    "user",
    (ctx: Context, id: SID_of<User>): OptimisticPromise<User | null> =>
      new OptimisticPromise((resolve, reject) =>
        this.queryAll(ctx)
          .whereId(P.equals(id))
          .genOnlyValue()
          .then(resolve, reject)
      )
  );

  update(data: Partial<Data>) {
    return new UpdateMutationBuilder(this.ctx, this.spec, this)
      .set(data)
      .toChangeset();
  }

  static create(ctx: Context, data: Partial<Data>) {
    return new CreateMutationBuilder(ctx, s).set(data).toChangeset();
  }

  delete() {
    return new DeleteMutationBuilder(this.ctx, this.spec, this).toChangeset();
  }
}
