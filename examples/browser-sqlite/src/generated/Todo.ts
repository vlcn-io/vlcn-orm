// SIGNED-SOURCE: <a2a078edd75fb74fcb1906a8d66fd4cb>
import { default as s } from "./TodoSpec.js";
import { P } from "@aphro/query-runtime-ts";
import { Model } from "@aphro/model-runtime-ts";
import { ModelSpec } from "@aphro/model-runtime-ts";
import { SID_of } from "@strut/sid";
import Node from "./Node.js";
import User from "./User.js";

export type Data = {
  id: SID_of<Node>;
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
}
