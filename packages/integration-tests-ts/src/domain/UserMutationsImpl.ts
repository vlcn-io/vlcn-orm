import { CreateArgs } from "./generated/UserMutations.js";
import { RenameArgs } from "./generated/UserMutations.js";
import { DeleteArgs } from "./generated/UserMutations.js";
import { Changeset, sid } from "@aphro/runtime-ts";
import { Data } from "./User.js";
import User from "./User.js";
import { IMutationBuilder } from "@aphro/runtime-ts";

export function createImpl(
  mutator: Omit<IMutationBuilder<User, Data>, "toChangeset">,
  { name }: CreateArgs
): void | Changeset<any>[] {
  mutator.set({
    name,
    created: Date.now(),
    modified: Date.now(),
  });
}

export function renameImpl(
  model: User,
  mutator: Omit<IMutationBuilder<User, Data>, "toChangeset">,
  { name }: RenameArgs
): void | Changeset<any>[] {
  mutator.set({
    name,
  });
}

export function deleteImpl(
  model: User,
  mutator: Omit<IMutationBuilder<User, Data>, "toChangeset">,
  {}: DeleteArgs
): void | Changeset<any>[] {
  // Use the provided mutator to make your desired changes.
  // e.g., mutator.set({name: "Foo" });
  // You do not need to return anything from this method. The mutator will track your changes.
  // If you do return changesets, those changesets will be applied in addition to the changes made to the mutator.
}
