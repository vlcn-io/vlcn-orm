/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import { ICreateOrUpdateBuilder } from "@aphro/runtime-ts";
import { Context } from "@aphro/runtime-ts";
import { MutationsBase } from "@aphro/runtime-ts";
import TodoList from "./TodoList.js";
import { Data } from "./TodoList.js";
import { SID_of } from "@aphro/runtime-ts";
import Todo from "./Todo.js";
declare class Mutations extends MutationsBase<TodoList, Data> {
    constructor(ctx: Context, mutator: ICreateOrUpdateBuilder<TodoList, Data>);
    create({}: {}): this;
    filter({ filter }: {
        filter: "all" | "active" | "completed";
    }): this;
    edit({ editing }: {
        editing: SID_of<Todo> | null;
    }): this;
}
export default class TodoListMutations {
    static create(ctx: Context, args: {}): Mutations;
    static filter(model: TodoList, args: {
        filter: "all" | "active" | "completed";
    }): Mutations;
    static edit(model: TodoList, args: {
        editing: SID_of<Todo> | null;
    }): Mutations;
}
export {};
//# sourceMappingURL=TodoListMutations.d.ts.map