// SIGNED-SOURCE: <015cc2e78232d09b224a3a67db78cb61>
import { Context } from '@aphro/runtime-ts';
import { ModelSpec } from '@aphro/runtime-ts';
import { default as UserSpec } from './UserSpec.js';
import { default as SlideSpec } from './SlideSpec.js';
import Deck from './Deck.js';
import { Data } from './Deck.js';

const spec: ModelSpec<Deck, Data> = {
  createFrom(ctx: Context, data: Data) {
    const existing = ctx.cache.get(data['id']);
    if (existing) {
      return existing;
    }
    return new Deck(ctx, data);
  },

  primaryKey: 'id',

  storage: {
    engine: 'sqlite',
    db: 'example',
    type: 'sql',
    tablish: 'deck',
  },

  outboundEdges: {
    owner: {
      type: 'field',
      sourceField: 'ownerId',
      destField: 'id',
      get source() {
        return spec;
      },
      dest: UserSpec,
    },
    slides: {
      type: 'foreignKey',
      sourceField: 'id',
      destField: 'deckId',
      get source() {
        return spec;
      },
      dest: SlideSpec,
    },
    selectedSlide: {
      type: 'field',
      sourceField: 'selectedSlideId',
      destField: 'id',
      get source() {
        return spec;
      },
      dest: SlideSpec,
    },
  },
};

export default spec;
