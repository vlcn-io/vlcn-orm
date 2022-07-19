import { commit, Context, P } from '@aphro/runtime-ts';
import { default as UserMutationsSQL } from '../generated/generated/UserMutations';
import { default as DeckMutationsSQL } from '../generated/generated/DeckMutations.js';
import { default as SlideMutationsSQL } from '../generated/generated/SlideMutations.js';

import { default as UserMutationsMem } from '../generated-memory/generated/UserMutations.js';
import { default as DeckMutationsMem } from '../generated-memory/generated/DeckMutations.js';
import { default as SlideMutationsMem } from '../generated-memory/generated/SlideMutations.js';

export default async function createGraph(ctx: Context) {
  await Promise.all([
    createGraphParametrized(ctx, SqlMutations),
    createGraphParametrized(ctx, MemMutations),
  ]);
}

type Mutations = typeof SqlMutations | typeof MemMutations;

const SqlMutations = {
  type: 'sql',
  UserMutations: UserMutationsSQL,
  DeckMutations: DeckMutationsSQL,
  SlideMutations: SlideMutationsSQL,
} as const;

const MemMutations = {
  type: 'mem',
  UserMutations: UserMutationsMem,
  DeckMutations: DeckMutationsMem,
  SlideMutations: SlideMutationsMem,
} as const;

async function createGraphParametrized<T extends Mutations>(ctx: Context, mutations: T) {
  const usersCs = [4, 3, 2, 1].map(i =>
    mutations.UserMutations.create(ctx, { name: 'U' + i }).toChangeset(),
  );
  const deckCs = mutations.DeckMutations.create(ctx, {
    name: 'Deck 1',
    // @ts-ignore
    owner: usersCs[0],
    selectedSlide: null,
  }).toChangeset();
  const ordering = [4, 3, 2, 1];
  const slidesCs = ordering.map(o =>
    mutations.SlideMutations.create(ctx, {
      // @ts-ignore
      deck: deckCs,
      order: o,
    }).toChangeset(),
  );
  await commit(ctx, ...usersCs, deckCs, ...slidesCs);
}
