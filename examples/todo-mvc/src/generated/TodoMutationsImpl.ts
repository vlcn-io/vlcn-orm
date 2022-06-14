import { CreateArgs } from "./TodoMutations.js";
import { ToggleCompleteArgs } from "./TodoMutations.js";
import { SetCompleteArgs } from "./TodoMutations.js";
import { ChangeTextArgs } from "./TodoMutations.js";
import { DeleteArgs } from "./TodoMutations.js";
import { Changeset, sid } from "@aphro/runtime-ts";
import { Data } from "./Todo.js";
import Todo from "./Todo.js";
import { IMutationBuilder } from "@aphro/runtime-ts";

export function createImpl(
  mutator: Omit<IMutationBuilder<Todo, Data>, "toChangeset">,
  { text, listId }: CreateArgs
): void | Changeset<any>[] {
  mutator.set({
    id: sid("AAAA"),
    text,
    listId,
    created: Date.now(),
    modified: Date.now(),
  });
}

export function toggleCompleteImpl(
  mutator: Omit<IMutationBuilder<Todo, Data>, "toChangeset">,
  { completed }: ToggleCompleteArgs
): void | Changeset<any>[] {
  mutator.set({
    completed: completed == null ? Date.now() : null,
  });
}

export function setCompleteImpl(
  mutator: Omit<IMutationBuilder<Todo, Data>, "toChangeset">,
  { completed }: SetCompleteArgs
): void | Changeset<any>[] {
  mutator.set({
    completed,
  });
}

export function changeTextImpl(
  mutator: Omit<IMutationBuilder<Todo, Data>, "toChangeset">,
  { text }: ChangeTextArgs
): void | Changeset<any>[] {
  mutator.set({
    text,
  });
}

export function deleteImpl(
  mutator: Omit<IMutationBuilder<Todo, Data>, "toChangeset">,
  {}: DeleteArgs
): void | Changeset<any>[] {}
