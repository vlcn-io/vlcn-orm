// If you make this a module you can allow other files to extend the type
import { FilteredChunkIterable, TakeChunkIterable } from './ChunkIterable.js';
import ModelLoadExpression from './ModelLoadExpression.js';
/*
declare module '@mono/model/query' {
  interface Expressions<ReturnType> {
    expr: () => ReturnType;
  }
}

export type Expression = // union of the mapping of return types of the members of the interface??
// maybe something like: https://github.com/ueberdosis/tiptap/blob/main/packages/core/src/types.ts#L197
*/
export function take(num) {
    return {
        type: 'take',
        num,
        chainAfter(iterable) {
            return new TakeChunkIterable(iterable, num);
        },
    };
}
export function before(cursor) {
    return {
        type: 'before',
        cursor,
        chainAfter(_) {
            throw new Error('Cursor must be consumed in plan optimization');
        },
    };
}
export function after(cursor) {
    return {
        type: 'after',
        cursor,
        chainAfter(_) {
            throw new Error('Cursor must be consumed in plan optimization');
        },
    };
}
// Needs to be more robust as we need to know if field and value are hoistable to the backend.
// So this should be some spec that references the schema in some way.
export function filter(getter, predicate) {
    return {
        type: 'filter',
        getter,
        predicate,
        chainAfter(iterable) {
            return new FilteredChunkIterable(iterable, async (m) => predicate.call(getter.get(m)));
        },
    };
}
export function orderBy(getter, direction) {
    throw new Error();
}
// put in the edge?
export function hop() {
    // hops have _kinds_
    // like SQL hops
    // or Cypher hops
    // We'd have to determine this by taking in the edge information from
    // the schema.
    throw new Error();
}
export function modelLoad(factory) {
    return new ModelLoadExpression(factory);
}
//# sourceMappingURL=Expression.js.map