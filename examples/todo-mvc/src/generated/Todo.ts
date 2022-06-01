// SIGNED-SOURCE: <5fa7ee57e71b5a710793fcedde09a23d>
import { default as s } from "./TodoSpec.js";
import { P } from "@aphro/runtime-ts";
import { Model } from "@aphro/runtime-ts";
import { ModelSpec } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import TodoQuery from "./TodoQuery.js";
import { Context } from "@aphro/runtime-ts";

export type Data = {
  id: SID_of<Todo>;
  text: string;
  created: number;
  modified: number;
  completed: number;
};

export default class Todo extends Model<Data> {
  readonly spec = s as ModelSpec<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as SID_of<this>;
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

  get completed(): number {
    return this.data.completed;
  }

  static queryAll(ctx: Context): TodoQuery {
    return TodoQuery.create(ctx);
  }
}
