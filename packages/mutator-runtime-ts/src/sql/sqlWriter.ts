// import { Context } from '@aphro/context-runtime-ts';
// import { IModel } from '@aphro/model-runtime-ts';
// import { nullthrows } from '@strut/utils';

// export default {
//   // Precondition: already grouped by db & table
//   // TODO: Should we grab all by DB so we can do many inserts in 1 statement to the
//   // same db?
//   async upsertGroup(ctx: Context, nodes: IModel<Object>[]): Promise<void> {
//     const first = nodes[0];
//     const persist = nullthrows(first._definition.schema.storage.persisted);

//     // TODO Can we make the db resolver return more richly typed things?
//     // So we can do stuff in native Knex rather than having to
//     // go to a query string and then to knex?
//     const db = context.dbResolver
//       .type(storageType(persist.engine))
//       .engine(persist.engine)
//       .db(persist.db);

//     // Ideally the above would return knex...
//     // so we don't have to re-construct knex below just for query building...

//     await db(persist.tablish)
//       .insert(nodes.map(n => (n as any)._data))
//       .onConflict('_id')
//       .merge();
//   },

//   async deleteGroup(context: Context, delets: DeleteChangeset<NodeSchema>[]): Promise<void> {},

//   async createTables(): Promise<void> {},
// };
