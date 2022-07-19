// SIGNED-SOURCE: <72580585d65b4f31f78cb0bd5bdb0412>
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
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import DeckQuery from "./DeckQuery.js";
import { Context } from "@aphro/runtime-ts";
import UserQuery from "./UserQuery.js";
import SlideQuery from "./SlideQuery.js";
import Slide from "../Slide.js";
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

  static queryAll(ctx: Context): DeckQuery {
    return DeckQuery.create(ctx);
  }

  static async genx(ctx: Context, id: SID_of<Deck>): Promise<Deck> {
    const existing = ctx.cache.get(id, "none", "deck");
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue();
  }

  static async gen(ctx: Context, id: SID_of<Deck>): Promise<Deck | null> {
    const existing = ctx.cache.get(id, "none", "deck");
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genOnlyValue();
  }

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
