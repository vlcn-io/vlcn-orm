import { commit, Context, P } from '@aphro/runtime-ts';
import UserMutations from '../generated/UserMutations';
import DeckMutations from '../generated/DeckMutations.js';
import SlideMutations from '../generated/SlideMutations.js';

export default async function createGraph(ctx: Context) {
  const usersCs = [4, 3, 2, 1].map(i => UserMutations.create(ctx, { name: 'U' + i }).toChangeset());
  const deckCs = DeckMutations.create(ctx, {
    name: 'Deck 1',
    owner: usersCs[0],
    selectedSlide: null,
  }).toChangeset();
  const ordering = [4, 3, 2, 1];
  const slidesCs = ordering.map(o =>
    SlideMutations.create(ctx, {
      deck: deckCs,
      order: o,
    }).toChangeset(),
  );
  const [persistHandle] = commit(ctx, ...usersCs, deckCs, ...slidesCs);
  await persistHandle;
}
