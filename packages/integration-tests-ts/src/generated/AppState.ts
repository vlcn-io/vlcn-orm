// SIGNED-SOURCE: <888edfd9654e1ba9b344a9d36f68cbb1>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { applyMixins } from "@aphro/runtime-ts";
import { default as s } from "./AppStateSpec.js";
import { P } from "@aphro/runtime-ts";
import { ManualMethods, manualMethods } from "./AppStateManualMethods.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
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

class AppState extends Node<Data> {
  readonly spec = s as NodeSpecWithCreate<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as SID_of<this>;
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
    return new UpdateMutationBuilder(this.ctx, this.spec, this).set(data);
  }
}

interface AppState extends ManualMethods {}
applyMixins(AppState, [manualMethods]);
export default AppState;
