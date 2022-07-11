// SIGNED-SOURCE: <915d5a5a09d644c9e9fcde3a714e3ffb>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { default as s } from "./ComponentSpec.js";
import { P } from "@aphro/runtime-ts";
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import ComponentQuery from "./ComponentQuery.js";
import { Context } from "@aphro/runtime-ts";
import Slide from "./Slide.js";

export type Data = {
  id: SID_of<Component>;
  subtype: "Text" | "Embed";
  slideId: SID_of<Slide>;
  content: string;
};

export default class Component extends Node<Data> {
  readonly spec = s as NodeSpecWithCreate<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as SID_of<this>;
  }

  get subtype(): "Text" | "Embed" {
    return this.data.subtype;
  }

  get slideId(): SID_of<Slide> {
    return this.data.slideId;
  }

  get content(): string {
    return this.data.content;
  }

  static queryAll(ctx: Context): ComponentQuery {
    return ComponentQuery.create(ctx);
  }

  static async genx(ctx: Context, id: SID_of<Component>): Promise<Component> {
    const existing = ctx.cache.get(id, Component.name);
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue();
  }

  static async gen(
    ctx: Context,
    id: SID_of<Component>
  ): Promise<Component | null> {
    const existing = ctx.cache.get(id, Component.name);
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genOnlyValue();
  }
}
