// SIGNED-SOURCE: <7de730b9ce76e86b1320c25e082891a0>
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
import { makeSavable } from "@aphro/runtime-ts";
import { modelGenMemo } from "@aphro/runtime-ts";
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
    (ctx: Context, id: SID_of<User>): Promise<User> =>
      this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue()
  );

  static gen = modelGenMemo<User, User | null>(
    "example",
    "user",
    (ctx: Context, id: SID_of<User>): Promise<User | null> =>
      this.queryAll(ctx).whereId(P.equals(id)).genOnlyValue()
  );

  update(data: Partial<Data>) {
    return makeSavable(
      this.ctx,
      new UpdateMutationBuilder(this.ctx, this.spec, this)
        .set(data)
        .toChangesets()[0]
    );
  }

  static create(ctx: Context, data: Partial<Data>) {
    return makeSavable(
      ctx,
      new CreateMutationBuilder(ctx, s).set(data).toChangesets()[0]
    );
  }

  delete() {
    return makeSavable(
      this.ctx,
      new DeleteMutationBuilder(this.ctx, this.spec, this).toChangesets()[0]
    );
  }
}
