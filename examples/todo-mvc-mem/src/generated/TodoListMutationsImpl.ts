import { CreateArgs } from "./TodoListMutations.js";
import { FilterArgs } from "./TodoListMutations.js";
import { EditArgs } from "./TodoListMutations.js";
import { Changeset, sid } from "@aphro/runtime-ts";
import { Data } from "./TodoList.js";
import TodoList from "./TodoList.js";
import { IMutationBuilder } from "@aphro/runtime-ts";

export function createImpl(
  mutator: Omit<IMutationBuilder<TodoList, Data>, "toChangeset">,
  {}: CreateArgs
): void | Changeset<any>[] {
  mutator.set({
    id: sid("AAAA"),
    filter: "all",
    editing: null,
  });
}

export function filterImpl(
  mutator: Omit<IMutationBuilder<TodoList, Data>, "toChangeset">,
  { filter }: FilterArgs
): void | Changeset<any>[] {
  mutator.set({
    filter,
  });
}

export function editImpl(
  mutator: Omit<IMutationBuilder<TodoList, Data>, "toChangeset">,
  { editing }: EditArgs
): void | Changeset<any>[] {
  mutator.set({ editing });
}
