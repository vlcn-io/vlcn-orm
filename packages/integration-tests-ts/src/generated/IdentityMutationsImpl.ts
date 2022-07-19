import { CreateArgs } from "./generated/IdentityMutations.js";
import { Changeset, sid } from "@aphro/runtime-ts";
import { Data } from "./generated/IdentityBase.js";
import Identity from "./Identity.js";
import { IMutationBuilder } from "@aphro/runtime-ts";

export function createImpl(
  mutator: Omit<IMutationBuilder<Identity, Data>, "toChangeset">,
  { identifier, token }: CreateArgs
): void | Changeset<any>[] {
  mutator.set({
    id: sid("aaaa"),
    identifier,
    token,
  });
}
