// SIGNED-SOURCE: <8d615e99950e021760f9fdae5960628e>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { applyMixins } from "@aphro/runtime-ts";
import { default as s } from "./SlideSpec.js";
import { P } from "@aphro/runtime-ts";
import { ManualMethods, manualMethods } from "./SlideManualMethods.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import SlideQuery from "./SlideQuery.js";
import { Context } from "@aphro/runtime-ts";
import ComponentQuery from "./ComponentQuery.js";
import Component from "./Component.js";
import Deck from "./Deck.js";

export type Data = {
  id: SID_of<Slide>;
  deckId: SID_of<Deck>;
  order: number;
};

class Slide extends Node<Data> {
  readonly spec = s as NodeSpecWithCreate<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as SID_of<this>;
  }

  get deckId(): SID_of<Deck> {
    return this.data.deckId;
  }

  get order(): number {
    return this.data.order;
  }

  queryComponents(): ComponentQuery {
    return ComponentQuery.create(this.ctx).whereSlideId(P.equals(this.id));
  }

  static queryAll(ctx: Context): SlideQuery {
    return SlideQuery.create(ctx);
  }

  static async genx(ctx: Context, id: SID_of<Slide>): Promise<Slide> {
    const existing = ctx.cache.get(id, Slide.name);
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue();
  }

  static async gen(ctx: Context, id: SID_of<Slide>): Promise<Slide | null> {
    const existing = ctx.cache.get(id, Slide.name);
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genOnlyValue();
  }

  update(data: Partial<Data>) {
    return new UpdateMutationBuilder(this.ctx, this.spec, this).set(data);
  }

  static create(ctx: Context, data: Partial<Data>) {
    return new CreateMutationBuilder(ctx, s).set(data);
  }

  delete() {
    return new DeleteMutationBuilder(this.ctx, s, this);
  }
}

interface Slide extends ManualMethods {}
applyMixins(Slide, [manualMethods]);
export default Slide;
