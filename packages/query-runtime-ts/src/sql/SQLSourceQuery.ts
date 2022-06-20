import { Context, INode, NodeSpecWithCreate } from '@aphro/context-runtime-ts';
import { SourceQuery } from '../Query.js';
import SQLSourceExpression from './SQLSourceExpression.js';

export default class SQLSourceQuery<T extends INode<Object>> extends SourceQuery<T> {
  constructor(ctx: Context, spec: NodeSpecWithCreate<T, Object>) {
    super(ctx, new SQLSourceExpression(ctx, spec, { what: 'model' }));
  }
}
