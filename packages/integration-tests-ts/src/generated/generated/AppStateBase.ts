// SIGNED-SOURCE: <0791e90b1cb59867680c84ff90ec936c>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import AppState from "../AppState.js";
import { default as s } from "./AppStateSpec.js";
import { P } from "@aphro/runtime-ts";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { makeSavable } from "@aphro/runtime-ts";
import { modelGenMemo } from "@aphro/runtime-ts";
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { Context } from "@aphro/runtime-ts";
import Deck from "../Deck.js";
import Identity from "../Identity.js";
import Component from "../Component.js";
import AppStateMutations from "./AppStateMutations.js";
import { InstancedMutations } from "./AppStateMutations.js";

declare type Muts = typeof AppStateMutations;
declare type IMuts = InstancedMutations;

export type Data = {
  id: SID_of<AppState>;
  identity: Identity;
  openDeckId: SID_of<Deck> | null;
  copiedComponents: readonly Component[];
};

// @Sealed(AppState)
export default abstract class AppStateBase extends Node<Data> {
  readonly spec = s as unknown as NodeSpecWithCreate<this, Data>;

  static get mutations(): Muts {
    return AppStateMutations;
  }

  get mutations(): IMuts {
    return new InstancedMutations(this);
  }

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

  delete() {
    return makeSavable(
      this.ctx,
      new DeleteMutationBuilder(this.ctx, this.spec, this).toChangesets()[0]
    );
  }
}
