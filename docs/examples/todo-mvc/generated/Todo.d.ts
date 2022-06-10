import { Model } from "@aphro/runtime-ts";
import { ModelSpec } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import TodoQuery from "./TodoQuery.js";
import { Context } from "@aphro/runtime-ts";
import TodoList from "./TodoList.js";
export declare type Data = {
    id: SID_of<Todo>;
    listId: SID_of<TodoList>;
    text: string;
    created: number;
    modified: number;
    completed: number | null;
};
export default class Todo extends Model<Data> {
    readonly spec: ModelSpec<this, Data>;
    get id(): SID_of<this>;
    get listId(): SID_of<TodoList>;
    get text(): string;
    get created(): number;
    get modified(): number;
    get completed(): number | null;
    static queryAll(ctx: Context): TodoQuery;
}
//# sourceMappingURL=Todo.d.ts.map