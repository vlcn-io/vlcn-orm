// SIGNED-SOURCE: <ec807b75a3a24e6aa104aedf9821a5a9>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import Person from "./Person.js";
import { Context } from "@aphro/runtime-ts";

export const resolvers = {
  Query: {
    async person(parent, args, ctx: { aphrodite: Context }, info): Person {
      return await Person.genOnly(ctx.aphrodite, args.id);
    },

    async persons(parent, args, ctx: { aphrodite: Context }, info): Person[] {
      return await Person.queryAll(ctx.aphrodite)
        .whereId(P.in(new Set(ctx.ids)))
        .gen();
    },
  },
};
