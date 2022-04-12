import { ModelSpec } from '@aphro/model-runtime-ts';
import { HoistedOperations } from './SqlSourceExpression.js';
import knex, { Knex } from 'knex';
import { after, before, filter, orderBy, take } from '../Expression.js';
import SQLHopExpression from './SQLHopExpression.js';

// given a model spec and hoisted operations, return the SQL query
export default function specAndOpsToSQL(spec: ModelSpec<any>, ops: HoistedOperations): string {
  const builder = getKnex(spec);
  let table = builder(spec.storage.tablish);

  const [lastSpec, lastWhat] = getLastSpecAndProjection(spec, ops);
  switch (lastWhat) {
    case 'count':
      table = table.select(`count(${lastSpec.primaryKey})`);
      break;
    case 'edges':
      throw new Error('edge projection not yet supported');
    case 'ids':
      table = table.select(lastSpec.primaryKey);
      break;
    case 'model':
      // TODO: lastSpec.fields.map(t.f).join(",");
      table = table.select('*');
      break;
  }

  table = applyFilters(table, ops.filters);
  table = applyBeforeAfter(table, ops.before, ops.after);
  table = applyOrderBy(table, ops.orderBy);
  table = applyLimit(table, ops.limit);
  table = applyHops(table, ops.hop);

  return '';
  // return sql('');
}

function getLastSpecAndProjection(
  spec: ModelSpec<any>,
  ops: HoistedOperations,
): [ModelSpec<any>, HoistedOperations['what']] {
  const hop = ops.hop;
  if (hop == null) {
    return [spec, ops.what];
  }

  return getLastSpecAndProjection(hop.spec, hop.ops);
}

function applyFilters<T extends Knex.QueryBuilder>(
  table: T,
  filters?: readonly ReturnType<typeof filter>[],
): T {
  if (!filters) {
    return table;
  }
  return filters.reduce((table, filter) => {
    return table;
  }, table);
}

function applyFilter<T extends Knex.QueryBuilder>(table: T, f: ReturnType<typeof filter>): T {
  return table;
}

function applyBeforeAfter<T extends Knex.QueryBuilder>(
  table: T,
  b?: ReturnType<typeof before>,
  a?: ReturnType<typeof after>,
): T {
  return table;
}

function applyOrderBy<T extends Knex.QueryBuilder>(table: T, o?: ReturnType<typeof orderBy>): T {
  return table;
}

function applyLimit<T extends Knex.QueryBuilder>(table: T, l?: ReturnType<typeof take>): T {
  return table;
}

function applyHops<T extends Knex.QueryBuilder>(table: T, hop?: SQLHopExpression<any>): T {
  return table;
}

function getKnex(spec: ModelSpec<any>) {
  switch (spec.storage.engine) {
    case 'mysql':
      return knex({ client: 'mysql' });
    case 'postgres':
      return knex({ client: 'pg' });
  }
}
