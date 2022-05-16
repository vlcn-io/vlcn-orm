// SIGNED-SOURCE: <6d3c8d5d25cc96d719ffdb213076b971>
import { default as s } from './TodoSpec.js';
import { P } from '@aphro/query-runtime-ts';
import { Model } from '@aphro/model-runtime-ts';
import { ModelSpec } from '@aphro/model-runtime-ts';
import { SID_of } from '@strut/sid';
import User from './User.js';

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
}
