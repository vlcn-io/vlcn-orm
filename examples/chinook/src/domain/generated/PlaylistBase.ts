// SIGNED-SOURCE: <4cf3f5d7484f184043c3177916ebf9e1>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import Playlist from "../Playlist.js";
import { default as s } from "./PlaylistSpec.js";
import { P } from "@aphro/runtime-ts";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { makeSavable } from "@aphro/runtime-ts";
import { modelGenMemo } from "@aphro/runtime-ts";
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import PlaylistQuery from "./PlaylistQuery.js";
import { Context } from "@aphro/runtime-ts";
import TrackQuery from "./TrackQuery.js";

export type Data = {
  id: SID_of<Playlist>;
  name: string;
};

// @Sealed(Playlist)
export default abstract class PlaylistBase extends Node<Data> {
  readonly spec = s as unknown as NodeSpecWithCreate<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as unknown as SID_of<this>;
  }

  get name(): string {
    return this.data.name;
  }

  queryTracks(): TrackQuery {
    return PlaylistQuery.fromId(this.ctx, this.id as any).queryTracks();
  }

  static queryAll(ctx: Context): PlaylistQuery {
    return PlaylistQuery.create(ctx);
  }

  static genx = modelGenMemo(
    "chinook",
    "playlist",
    (ctx: Context, id: SID_of<Playlist>): Promise<Playlist> =>
      this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue()
  );

  static gen = modelGenMemo<Playlist | null>(
    "chinook",
    "playlist",
    // @ts-ignore #43
    (ctx: Context, id: SID_of<Playlist>): Promise<Playlist | null> =>
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
