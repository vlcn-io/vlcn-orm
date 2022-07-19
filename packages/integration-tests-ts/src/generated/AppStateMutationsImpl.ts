import { CreateArgs } from "./generated/AppStateMutations.js";
import { OpenDeckArgs } from "./generated/AppStateMutations.js";
import { Changeset } from "@aphro/runtime-ts";
import { Data } from "./AppState.js";
import AppState from "./AppState.js";
import { IMutationBuilder } from "@aphro/runtime-ts";

export function createImpl(
  mutator: Omit<IMutationBuilder<AppState, Data>, "toChangeset">,
  { identity, openDeckId }: CreateArgs
): void | Changeset<any>[] {
  // Use the provided mutator to make your desired changes.
  // e.g., mutator.set({name: "Foo" });
  // You do not need to return anything from this method. The mutator will track your changes.
  // If you do return changesets, those changesets will be applied in addition to the changes made to the mutator.
  throw new Error(
    "You must implement the mutation create for schema AppState in AppStateMutationsImpl.ts"
  );
}

export function openDeckImpl(
  mutator: Omit<IMutationBuilder<AppState, Data>, "toChangeset">,
  { openDeck }: OpenDeckArgs
): void | Changeset<any>[] {
  // Use the provided mutator to make your desired changes.
  // e.g., mutator.set({name: "Foo" });
  // You do not need to return anything from this method. The mutator will track your changes.
  // If you do return changesets, those changesets will be applied in addition to the changes made to the mutator.
  throw new Error(
    "You must implement the mutation openDeck for schema AppState in AppStateMutationsImpl.ts"
  );
}
