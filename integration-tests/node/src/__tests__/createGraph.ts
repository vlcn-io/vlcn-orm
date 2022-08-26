import { commit, Context, P } from '@aphro/runtime-ts';
import { default as UserMutationsSQL } from '../domain/generated/UserMutations';
import { default as DeckMutationsSQL } from '../domain/generated/DeckMutations.js';
import { default as SlideMutationsSQL } from '../domain/generated/SlideMutations.js';

import { default as UserMutationsMem } from '../domain-memory/generated/UserMutations.js';
import { default as DeckMutationsMem } from '../domain-memory/generated/DeckMutations.js';
import { default as SlideMutationsMem } from '../domain-memory/generated/SlideMutations.js';

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
  const usersCs = [4, 3, 2, 1].flatMap(i =>
    mutations.UserMutations.create(ctx, { name: 'U' + i }).toChangesets(),
  );
  const deckCs = mutations.DeckMutations.create(ctx, {
    name: 'Deck 1',
    // @ts-ignore
    owner: usersCs[0],
    selectedSlide: null,
  }).toChangesets();
  const ordering = [4, 3, 2, 1];
  const slidesCs = ordering.flatMap(o =>
    mutations.SlideMutations.create(ctx, {
      // @ts-ignore
      deck: deckCs[0],
      order: o,
    }).toChangesets(),
  );
  await commit(ctx, ...usersCs, ...deckCs, ...slidesCs);
}
