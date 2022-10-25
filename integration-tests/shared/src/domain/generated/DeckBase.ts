// SIGNED-SOURCE: <c5f95813c66bdc7f1085d08f2aa142a3>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import Deck from "../Deck.js";
import { default as s } from "./DeckSpec.js";
import { P } from "@aphro/runtime-ts";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { makeSavable } from "@aphro/runtime-ts";
import { modelGenMemo } from "@aphro/runtime-ts";
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import DeckQuery from "./DeckQuery.js";
import { Context } from "@aphro/runtime-ts";
import UserQuery from "./UserQuery.js";
import UserSpec from "./UserSpec.js";
import SlideQuery from "./SlideQuery.js";
import Slide from "../Slide.js";
import SlideSpec from "./SlideSpec.js";
import User from "../User.js";

export type Data = {
  id: SID_of<Deck>;
  name: string;
  created: number;
  modified: number;
  ownerId: SID_of<User>;
  selectedSlideId: SID_of<Slide> | null;
};

// @Sealed(Deck)
export default abstract class DeckBase extends Node<Data> {
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

  get ownerId(): SID_of<User> {
    return this.data.ownerId;
  }

  get selectedSlideId(): SID_of<Slide> | null {
    return this.data.selectedSlideId;
  }

  queryOwner(): UserQuery {
    return UserQuery.fromId(this.ctx, this.ownerId);
  }
  querySlides(): SlideQuery {
    return SlideQuery.create(this.ctx).whereDeckId(P.equals(this.id as any));
  }
  querySelectedSlide(): SlideQuery {
    if (this.selectedSlideId == null) {
      return SlideQuery.empty(this.ctx);
    }
    return SlideQuery.fromId(this.ctx, this.selectedSlideId);
  }
  queryEditors(): UserQuery {
    return DeckQuery.fromId(this.ctx, this.id as any).queryEditors();
  }

  async genOwner(): Promise<User> {
    const existing = this.ctx.cache.get(
      this.ownerId,
      UserSpec.storage.db,
      UserSpec.storage.tablish
    );
    if (existing != null) {
      return existing;
    }
    return await this.queryOwner().genxOnlyValue();
  }

  async genSelectedSlide(): Promise<Slide | null> {
    const existing = this.ctx.cache.get(
      this.selectedSlideId,
      SlideSpec.storage.db,
      SlideSpec.storage.tablish
    );
    if (existing != null) {
      return existing;
    }
    return await this.querySelectedSlide().genOnlyValue();
  }

  static queryAll(ctx: Context): DeckQuery {
    return DeckQuery.create(ctx);
  }

  static genx = modelGenMemo(
    "example",
    "deck",
    (ctx: Context, id: SID_of<Deck>): Promise<Deck> =>
      this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue()
  );

  static gen = modelGenMemo<Deck, Deck | null>(
    "example",
    "deck",
    (ctx: Context, id: SID_of<Deck>): Promise<Deck | null> =>
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
