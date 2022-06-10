/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import { ICreateOrUpdateBuilder } from "@aphro/runtime-ts";
import { Context } from "@aphro/runtime-ts";
import { MutationsBase } from "@aphro/runtime-ts";
import Todo from "./Todo.js";
import { Data } from "./Todo.js";
import { SID_of } from "@aphro/runtime-ts";
import TodoList from "./TodoList.js";
declare class Mutations extends MutationsBase<Todo, Data> {
    constructor(ctx: Context, mutator: ICreateOrUpdateBuilder<Todo, Data>);
    create({ text, listId }: {
        text: string;
        listId: SID_of<TodoList>;
    }): this;
    toggleComplete({ completed }: {
        completed: number | null;
    }): this;
    setComplete({ completed }: {
        completed: number | null;
    }): this;
    changeText({ text }: {
        text: string;
    }): this;
    delete({}: {}): this;
}
export default class TodoMutations {
    static create(ctx: Context, args: {
        text: string;
        listId: SID_of<TodoList>;
    }): Mutations;
    static toggleComplete(model: Todo, args: {
        completed: number | null;
    }): Mutations;
    static setComplete(model: Todo, args: {
        completed: number | null;
    }): Mutations;
    static changeText(model: Todo, args: {
        text: string;
    }): Mutations;
    static delete(model: Todo, args: {}): Mutations;
}
export {};
//# sourceMappingURL=TodoMutations.d.ts.map