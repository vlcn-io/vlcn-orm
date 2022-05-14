import { Context } from '@aphro/context-runtime-ts';
import { NodeSpec } from '@aphro/schema-api';
import { IModel } from './Model';

export type ModelSpec<M extends IModel<D>, D extends {}> = {
  createFrom(context: Context, data: D): M;
} & NodeSpec;
