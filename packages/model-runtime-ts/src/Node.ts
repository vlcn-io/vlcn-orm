import { SID_of } from '@strut/sid';
import { Disposer } from '@strut/events';
import { Context } from '@aphro/context-runtime-ts';
import { typedKeys } from '@strut/utils';
import { INode, NodeSpecWithCreate } from '@aphro/context-runtime-ts';
import Model from './Model.js';

export interface HasId {
  readonly id: SID_of<this>;
}

export function isHasId(object: any): object is HasId {
  return 'id' in object && typeof object.id === 'string';
}

export default abstract class Node<T extends {}> extends Model<T> implements INode<T> {
  abstract readonly id: SID_of<this>;
  abstract readonly spec: NodeSpecWithCreate<this, T>;

  constructor(ctx: Context, data: T) {
    super(ctx, data);
  }
}
