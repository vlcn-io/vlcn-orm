// SIGNED-SOURCE: <27692841a2c8c823fd282d35dc964acf>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import Person from "./Person.js";
import { Context } from "@aphro/runtime-ts";
import { P } from "@aphro/runtime-ts";

export const resolvers = {
  Query: {
    async person(
      parent,
      args,
      ctx: { aphrodite: Context },
      info
    ): Promise<Person> {
      return await Person.gen(ctx.aphrodite, args.id);
    },

    async persons(
      parent,
      args,
      ctx: { aphrodite: Context },
      info
    ): Promise<Person[]> {
      return await Person.queryAll(ctx.aphrodite)
        .whereId(P.in(new Set(args.ids)))
        .gen();
    },
  },
};
