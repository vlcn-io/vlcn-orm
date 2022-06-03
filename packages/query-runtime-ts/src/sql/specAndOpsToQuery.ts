import { HoistedOperations } from './SqlExpression.js';
import { after, before, filter, orderBy, take } from '../Expression.js';
import SQLHopExpression from './SQLHopExpression.js';
import { ModelFieldGetter } from '../Field.js';
import { NodeSpec } from '@aphro/schema-api';
import { invariant } from '@strut/utils';
import { sql, SQL } from '@aphro/sql-ts';

// given a model spec and hoisted operations, return the SQL query
export default function specAndOpsToQuery(spec: NodeSpec, ops: HoistedOperations): SQL {
  // nit: this doesn't take into account limits in between hops.
  // SELECT projection FROM table {hops} {filters} {before/after} {orderby} {limit}
  const baseTemplate = sql`
    SELECT ${'Q'} FROM ${'T'} ${'LQ'} ${'Q?'} ${'Q?'} ${'Q?'} ${'Q?'}
  `;

  const [lastSpec, lastWhat] = getLastSpecAndProjection(spec, ops);
  const projection = (() => {
    switch (lastWhat) {
      case 'count':
        return sql`count(${'T'}.${'C'})`(lastSpec.storage.tablish, lastSpec.primaryKey);
      case 'edges':
        throw new Error('edge projection not yet supported');
      case 'ids':
        return sql`${'T'}.${'C'}`(lastSpec.storage.tablish, lastSpec.primaryKey);
      case 'model':
        // TODO: explicitly name the fields so we get the right order!
        return sql`${'T'}.*`(lastSpec.storage.tablish);
    }
  })();

  // Hops must be applied first
  // Given filters, limits, orders, etc. occur at the end of a SQL statement
  const hops = getHops([], spec, ops.hop);

  // applyFilters needs to also grab filters from the hops
  const filters = getFilters(spec, ops.filters);
  // should also grab before/afters from the hops
  const beforeAndAfter = getBeforeAndAfter(ops.before, ops.after);
  // should also grab order bys from the hops and apply in-order of the hops
  const orderBy = getOrderBy(spec, ops.orderBy);
  // `applyHops` takes limits into account given they change the nature of the join to a sub-select
  const limit = getLimit(ops.limit);

  return baseTemplate(
    projection,
    spec.storage.tablish,
    hops,
    filters,
    beforeAndAfter,
    orderBy,
    limit,
  );
}

function getLastSpecAndProjection(
  spec: NodeSpec,
  ops: HoistedOperations,
): [NodeSpec, HoistedOperations['what']] {
  const hop = ops.hop;
  if (hop == null) {
    return [spec, ops.what];
  }

  return getLastSpecAndProjection(hop.destSpec, hop.ops);
}

function getFilters(spec: NodeSpec, filters?: readonly ReturnType<typeof filter>[]): SQL | null {
  if (!filters || filters.length === 0) {
    return null;
  }

  return sql`WHERE ${'LQA'}`(filters.map(f => getFilter(spec, f)));
}

function getFilter(spec: NodeSpec, f: ReturnType<typeof filter>): SQL {
  const getter = f.getter as ModelFieldGetter<any, any, any>;
  let op: string | null = null;
  const predicate = f.predicate;
  switch (predicate.type) {
    case 'equal':
      if (predicate.value === null) {
        return sql`${'T'}.${'C'} IS NULL`(spec.storage.tablish, getter.fieldName);
      }
      op = '=';
      break;
    case 'notEqual':
      if (predicate.value === null) {
        return sql`${'T'}.${'C'} IS NOT NULL`(spec.storage.tablish, getter.fieldName);
      }
      op = '<>';
      break;
    case 'lessThan':
      op = '<';
      break;
    case 'greaterThan':
      op = '>';
      break;
    case 'lessThanOrEqual':
      op = '<=';
      break;
    case 'greaterThanOrEqual':
      op = '>=';
      break;
    case 'in':
      return sql`${'T'}.${'C'} IN (${'La'})`(
        spec.storage.tablish,
        getter.fieldName,
        predicate.value as any,
      );
    case 'notIn':
      return sql`${'T'}.${'C'} NOT IN (${'La'})`(
        spec.storage.tablish,
        getter.fieldName,
        predicate.value as any,
      );
  }

  return sql`${'T'}.${'C'} ${'l'} ${'a'}`(
    spec.storage.tablish,
    getter.fieldName,
    op,
    f.predicate.value as any,
  );
}

function getBeforeAndAfter(
  b?: ReturnType<typeof before>,
  a?: ReturnType<typeof after>,
): SQL | null {
  // TODO: we should figure this one out... e.g., unrolling the cursors and such.
  // should that concern be here tho?
  // or should we just be at > or < at this level?
  return null;
}

function getOrderBy(spec: NodeSpec, o?: ReturnType<typeof orderBy>): SQL | null {
  // TODO: also apply o
  return sql`ORDER BY ${'C'} DESC`(spec.primaryKey);
}

function getLimit(l?: ReturnType<typeof take>): SQL | null {
  return null;
}

/**
 * This should be very similar to `SQLSourceExpression`
 * The only difference is that we're starting with something.
 *
 * SQLSource is:
 * `SELECT x FROM foo WHERE filters LIMIT limit ORDER BY order`
 *
 * SQLHop is:
 * ` --- WHERE filters LIMIT limit ORDER BY order` ?
 *
 * The hop exists in all aspects except its join. When the hop is folded
 * into the source expression is when the join is finally applied?
 *
 * Final join would look something like:
 * SELECT public.component.* FROM public.user
 *  JOIN public.deck ON public.deck."ownerId" = public.user.id
 *  JOIN public.slide ON public.slide."deckId" = public.deck.id
 *  JOIN public.component ON public.component."slideId" = public.slide.id
 *
 * Last hoisted join is what is selected from.
 *
 * If we're fetching edges along with edge traversals:
 * `SELECT public.component.*, public.slide.*`
 * (to fix 1+N query problem)
 *
 * So `spec and ops to sql` will have received the list of hops
 * in the source expression.
 *
 * It can follow this linked list to find the hops that are supposed to return
 * data and craft the initial select to respect that.
 *
 * Orders, offsets, limits in a hop?
 *
 * Hop cases:
 *  No limit on non terminal hops:
 *   Field:
 *   SELECT B.* FROM A JOIN B on A.field = B.id
 *   Fk:
 *   SELECT B.* FROM A JOIN B on A.id = B.fk
 *   Jx (forward):
 *   SELECT B.* FROM A JOIN Jx on A.id = Jx.id1 JOIN B on B.id = Jx.id2
 *   Jx (reverse):
 *   SELECT B.* FROM A JOIN Jx ON A.id = Jx.id2 JOIN B on B.id = Jx.id1
 *
 *  filters & order bys on intermediate hops are fine to apply at the end of the main select.
 *
 *  Limit on non terminal hop:
 *   Field:
 *   SELECT B.* FROM (SELECT * FROM A LIMIT 10) as Ass JOIN B on Ass.field = B.id
 *
 * Limits on non-terminal hops just switch the table from "TABLE_NAME" to "(SELECT * FROM TABLE_NAME LIMIT X) AS TABLE_NAMEss"
 *
 */
function getHops(hops: SQL[], source: NodeSpec, hop?: SQLHopExpression<any, any>): SQL[] {
  if (!hop) {
    return hops;
  }

  invariant(source === hop.edge.source, 'Edge source and provided source are mismatched!');

  const ops = hop.ops;
  const edge = hop.edge;

  // TODO: handle if the hop has a limit applied.
  switch (edge.type) {
    case 'field':
    case 'foreignKey':
      hops.push(
        sql`JOIN ${'T'} ON ${'T'}.${'C'} = ${'T'}.${'C'}`(
          edge.dest.storage.tablish,
          edge.source.storage.tablish,
          edge.sourceField,
          edge.dest.storage.tablish,
          edge.destField,
        ),
      );
      // Could be more hops to join in
      return getHops(hops, edge.dest, ops.hop);
    case 'junction':
      // TODO: could be traversing the junction in the reverse direction
      hops.push(
        sql`JOIN ${'T'} ON ${'T'}.${'C'} = ${'T'}.${'C'} JOIN ${'T'} ON ${'T'}.${'C'} = ${'T'}.${'C'}`(
          edge.storage.tablish,
          edge.source.storage.tablish,
          edge.source.primaryKey,
          edge.storage.tablish,
          'id1',
          edge.dest.storage.tablish,
          edge.storage.tablish,
          'id2',
          edge.dest.storage.tablish,
          edge.dest.primaryKey,
        ),
      );
      return getHops(hops, edge.dest, ops.hop);
  }
}
