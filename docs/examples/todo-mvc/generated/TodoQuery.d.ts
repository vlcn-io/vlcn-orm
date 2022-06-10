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
import Todo from "./Todo.js";
import { Data } from "./Todo.js";
export default class TodoQuery extends DerivedQuery<Todo> {
    static create(ctx: Context): TodoQuery;
    static fromId(ctx: Context, id: SID_of<Todo>): TodoQuery;
    whereId(p: Predicate<Data["id"]>): TodoQuery;
    whereListId(p: Predicate<Data["listId"]>): TodoQuery;
    whereText(p: Predicate<Data["text"]>): TodoQuery;
    whereCreated(p: Predicate<Data["created"]>): TodoQuery;
    whereModified(p: Predicate<Data["modified"]>): TodoQuery;
    whereCompleted(p: Predicate<Data["completed"]>): TodoQuery;
}
//# sourceMappingURL=TodoQuery.d.ts.map