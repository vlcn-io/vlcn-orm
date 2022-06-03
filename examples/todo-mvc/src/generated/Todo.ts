// SIGNED-SOURCE: <b6d3d291707e197af64ebd660be4d8ec>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import { default as s } from "./TodoSpec.js";
import { P } from "@aphro/runtime-ts";
import { Model } from "@aphro/runtime-ts";
import { ModelSpec } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import TodoQuery from "./TodoQuery.js";
import { Context } from "@aphro/runtime-ts";
import TodoList from "./TodoList.js";

export type Data = {
  id: SID_of<Todo>;
  listId: SID_of<TodoList>;
  text: string;
  created: number;
  modified: number;
  completed: number | null;
};

export default class Todo extends Model<Data> {
  readonly spec = s as ModelSpec<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as SID_of<this>;
  }

  get listId(): SID_of<TodoList> {
    return this.data.listId;
  }

  get text(): string {
    return this.data.text;
  }

  get created(): number {
    return this.data.created;
  }

  get modified(): number {
    return this.data.modified;
  }

  get completed(): number | null {
    return this.data.completed;
  }

  static queryAll(ctx: Context): TodoQuery {
    return TodoQuery.create(ctx);
  }
}
