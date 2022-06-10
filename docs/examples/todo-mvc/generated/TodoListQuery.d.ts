/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import { Context } from "@aphro/runtime-ts";
import { DerivedQuery } from "@aphro/runtime-ts";
import { Predicate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import TodoList from "./TodoList.js";
import { Data } from "./TodoList.js";
import TodoQuery from "./TodoQuery";
export default class TodoListQuery extends DerivedQuery<TodoList> {
    static create(ctx: Context): TodoListQuery;
    static fromId(ctx: Context, id: SID_of<TodoList>): TodoListQuery;
    whereId(p: Predicate<Data["id"]>): TodoListQuery;
    whereFilter(p: Predicate<Data["filter"]>): TodoListQuery;
    whereEditing(p: Predicate<Data["editing"]>): TodoListQuery;
    queryTodos(): TodoQuery;
}
//# sourceMappingURL=TodoListQuery.d.ts.map