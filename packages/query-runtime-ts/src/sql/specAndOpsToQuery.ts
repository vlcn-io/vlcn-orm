import { HoistedOperations } from './SqlExpression.js';
import { Knex } from 'knex';
import { after, before, filter, orderBy, take } from '../Expression.js';
import SQLHopExpression from './SQLHopExpression.js';
import { ModelFieldGetter } from '../Field.js';
import { NodeSpec } from '@aphro/schema-api';
import { invariant } from '@strut/utils';

// given a model spec and hoisted operations, return the SQL query
export default function specAndOpsToQuery(
  spec: NodeSpec,
  ops: HoistedOperations,
  db: Knex,
): Knex.QueryBuilder {
  let table = db(spec.storage.tablish);

  const [lastSpec, lastWhat] = getLastSpecAndProjection(spec, ops);
  switch (lastWhat) {
    case 'count':
      table = table.select(`count(${lastSpec.storage.tablish}.${lastSpec.primaryKey})`);
      break;
    case 'edges':
      throw new Error('edge projection not yet supported');
    case 'ids':
      table = table.select(lastSpec.storage.tablish + '.' + lastSpec.primaryKey);
      break;
    case 'model':
      // TODO: explicitly name the fields so we get the right order?
      table = table.select(`${lastSpec.storage.tablish}.*`);
      break;
  }

  // Hops must be applied first
  // Given filters, limits, orders, etc. occur at the end of a SQL statement
  table = applyHops(spec, table, ops.hop);
  // applyFilters needs to also grab filters from the hops
  table = applyFilters(table, ops.filters);
  // should also grab before/afters from the hops
  table = applyBeforeAndAfter(table, ops.before, ops.after);
  // should also grab order bys from the hops and apply in-order of the hops
  table = applyOrderBy(table, ops.orderBy);
  // `applyHops` takes limits into account given they change the nature of the join to a sub-select
  table = applyLimit(table, ops.limit);

  return table;
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

function applyFilters<T extends Knex.QueryBuilder>(
  table: T,
  filters?: readonly ReturnType<typeof filter>[],
): Knex.QueryBuilder {
  if (!filters) {
    return table;
  }
  let first = true;
  return filters.reduce((table, filter) => {
    let type: 'none' | 'and' = first ? 'none' : 'and';
    first = false;
    return applyFilter(table, filter, type);
  }, table);
}

function applyFilter<T extends Knex.QueryBuilder>(
  table: T,
  f: ReturnType<typeof filter>,
  type: 'none' | 'and' | 'or',
): Knex.QueryBuilder {
  const getter = f.getter as ModelFieldGetter<any, any, any>;
  let op: string | null = null;
  const predicate = f.predicate;
  switch (predicate.type) {
    case 'equal':
      op = '=';
      break;
    case 'notEqual':
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
      return table.whereIn(getter.fieldName, predicate.value as any);
    case 'notIn':
      return table.whereNotIn(getter.fieldName, predicate.value as any);
  }

  return table.where(getter.fieldName, op, f.predicate.value as any);
}

function applyBeforeAndAfter<T extends Knex.QueryBuilder>(
  table: T,
  b?: ReturnType<typeof before>,
  a?: ReturnType<typeof after>,
): T {
  // TODO: we should figure this one out... e.g., unrolling the cursors and such.
  // should that concern be here tho?
  // or should we just be at > or < at this level?
  return table;
}

function applyOrderBy<T extends Knex.QueryBuilder>(table: T, o?: ReturnType<typeof orderBy>): T {
  return table;
}

function applyLimit<T extends Knex.QueryBuilder>(table: T, l?: ReturnType<typeof take>): T {
  return table;
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
function applyHops(
  source: NodeSpec,
  builder: Knex.QueryBuilder,
  hop?: SQLHopExpression<any, any>,
): Knex.QueryBuilder {
  if (!hop) {
    return builder;
  }

  invariant(source === hop.edge.source, 'Edge source and provided source are mismatched!');

  const ops = hop.ops;
  const edge = hop.edge;

  // TODO: handle if the hop has a limit applied.
  switch (edge.type) {
    case 'field':
    case 'foreignKey':
      builder = builder.join(
        edge.dest.storage.tablish,
        `${edge.source.storage.tablish}.${edge.sourceField}`,
        `${edge.dest.storage.tablish}.${edge.destField}`,
      );
      // Could be more hops to join in
      return applyHops(edge.dest, builder, ops.hop);
    case 'junction':
      // TODO: could be traversing the junction in the reverse direction
      builder = builder
        .join(
          edge.storage.tablish,
          `${edge.source.storage.tablish}.${edge.source.primaryKey}`,
          `${edge.storage.tablish}.id1`,
        )
        .join(
          edge.dest.storage.tablish,
          `${edge.storage.tablish}.id2`,
          `${edge.dest.storage.tablish}.${edge.dest.primaryKey}`,
        );
      return applyHops(edge.dest, builder, ops.hop);
  }
}
