// SIGNED-SOURCE: <a6e9876bae5d7dc0388623444e2eb0d3>
import { default as s } from "./TodoSpec.js";
import { P } from "@aphro/runtime-ts";
import { Model } from "@aphro/runtime-ts";
import { ModelSpec } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import TodoQuery from "./TodoQuery.js";
import { Context } from "@aphro/runtime-ts";
import User from "./User.js";

export type Data = {
  id: SID_of<Todo>;
  text: string;
  created: number;
  modified: number;
  ownerId: SID_of<User>;
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

  get ownerId(): SID_of<User> {
    return this.data.ownerId;
  }

  static queryAll(ctx: Context): TodoQuery {
    return TodoQuery.create(ctx);
  }
}
