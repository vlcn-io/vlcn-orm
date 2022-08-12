// SIGNED-SOURCE: <c8824d6dbabfeca1cdd251b5ad9a3593>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import MediaType from "../MediaType.js";
import { default as s } from "./MediaTypeSpec.js";
import { P } from "@aphro/runtime-ts";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { makeSavable } from "@aphro/runtime-ts";
import { modelGenMemo } from "@aphro/runtime-ts";
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import MediaTypeQuery from "./MediaTypeQuery.js";
import { Context } from "@aphro/runtime-ts";

export type Data = {
  id: SID_of<MediaType>;
  name: string;
};

// @Sealed(MediaType)
export default abstract class MediaTypeBase extends Node<Data> {
  readonly spec = s as unknown as NodeSpecWithCreate<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as unknown as SID_of<this>;
  }

  get name(): string {
    return this.data.name;
  }

  static queryAll(ctx: Context): MediaTypeQuery {
    return MediaTypeQuery.create(ctx);
  }

  static genx = modelGenMemo(
    "chinook",
    "mediatype",
    (ctx: Context, id: SID_of<MediaType>): Promise<MediaType> =>
      this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue()
  );

  static gen = modelGenMemo<MediaType | null>(
    "chinook",
    "mediatype",
    // @ts-ignore #43
    (ctx: Context, id: SID_of<MediaType>): Promise<MediaType | null> =>
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
