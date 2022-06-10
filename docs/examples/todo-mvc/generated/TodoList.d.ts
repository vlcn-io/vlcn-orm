import { Model } from "@aphro/runtime-ts";
import { ModelSpec } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import TodoListQuery from "./TodoListQuery.js";
import { Context } from "@aphro/runtime-ts";
import TodoQuery from "./TodoQuery.js";
import Todo from "./Todo.js";
export declare type Data = {
    id: SID_of<TodoList>;
    filter: "all" | "active" | "completed";
    editing: SID_of<Todo> | null;
};
export default class TodoList extends Model<Data> {
    readonly spec: ModelSpec<this, Data>;
    get id(): SID_of<this>;
    get filter(): "all" | "active" | "completed";
    get editing(): SID_of<Todo> | null;
    queryTodos(): TodoQuery;
    static queryAll(ctx: Context): TodoListQuery;
}
//# sourceMappingURL=TodoList.d.ts.map