// SIGNED-SOURCE: <2b3aa28305441fe5b013c4f3c4659295>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import AppState from "./AppState.js";
import { default as s } from "./AppStateSpec.js";
import { P } from "@aphro/runtime-ts";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { Context } from "@aphro/runtime-ts";
import Deck from "./Deck.js";
import Identity from "./Identity.js";
import Component from "./Component.js";

export type Data = {
  id: SID_of<AppState>;
  identity: Identity;
  openDeckId: SID_of<Deck> | null;
  copiedComponents: readonly Component[];
};

// @Sealed(AppState)
export default abstract class AppStateBase extends Node<Data> {
  readonly spec = s as unknown as NodeSpecWithCreate<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as unknown as SID_of<this>;
  }

  get identity(): Identity {
    return this.data.identity;
  }

  get openDeckId(): SID_of<Deck> | null {
    return this.data.openDeckId;
  }

  get copiedComponents(): readonly Component[] {
    return this.data.copiedComponents;
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
