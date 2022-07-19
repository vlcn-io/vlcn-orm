import { CreateArgs } from "./generated/GenreMutations.js";
import { RenameArgs } from "./generated/GenreMutations.js";
import { Changeset } from "@aphro/runtime-ts";
import { Data } from "./Genre.js";
import Genre from "./Genre.js";
import { IMutationBuilder, sid } from "@aphro/runtime-ts";
import deviceId from "../deviceId.js";

export function createImpl(
  mutator: Omit<IMutationBuilder<Genre, Data>, "toChangeset">,
  { name }: CreateArgs
): void | Changeset<any>[] {
  mutator.set({
    id: sid(deviceId),
    name,
  });
}

export function renameImpl(
  mutator: Omit<IMutationBuilder<Genre, Data>, "toChangeset">,
  { name }: RenameArgs
): void | Changeset<any>[] {
  mutator.set({
    name,
  });
}
