// SIGNED-SOURCE: <e258a7f445e8e936b3630a7f2a510dcd>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { applyMixins } from "@aphro/runtime-ts";
import { default as s } from "./IdentitySpec.js";
import { P } from "@aphro/runtime-ts";
import { ManualMethods, manualMethods } from "./IdentityManualMethods.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { Context } from "@aphro/runtime-ts";

export type Data = {
  id: SID_of<Identity>;
  identifier: string;
  token: string;
};

class Identity extends Node<Data> {
  readonly spec = s as NodeSpecWithCreate<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as SID_of<this>;
  }

  get identifier(): string {
    return this.data.identifier;
  }

  get token(): string {
    return this.data.token;
  }

  update(data: Partial<Data>) {
    return new UpdateMutationBuilder(this.ctx, this.spec, this).set(data);
  }
}

interface Identity extends ManualMethods {}
applyMixins(Identity, [manualMethods]);
export default Identity;
