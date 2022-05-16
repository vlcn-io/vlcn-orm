// SIGNED-SOURCE: <521e6cc7f230c117d7004ccf3b26f046>
import { default as s } from "./UserSpec.js";
import { P } from "@aphro/query-runtime-ts";
import { Model } from "@aphro/model-runtime-ts";
import { ModelSpec } from "@aphro/model-runtime-ts";
import { SID_of } from "@strut/sid";
import TodoQuery from "./TodoQuery.js";
import Todo from "./Todo.js";

export type Data = {
  id: SID_of<User>;
  name: string;
  created: number;
  modified: number;
};

export default class User extends Model<Data> {
  readonly spec = s as ModelSpec<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as SID_of<this>;
  }

  get name(): string {
    return this.data.name;
  }

  get created(): number {
    return this.data.created;
  }

  get modified(): number {
    return this.data.modified;
  }

  queryTodos(): TodoQuery {
    return TodoQuery.create(this.ctx).whereOwnerId(P.equals(this.id));
  }
}
