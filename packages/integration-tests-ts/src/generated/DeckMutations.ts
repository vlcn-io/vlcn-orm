// SIGNED-SOURCE: <94d44c30c5fc72969c647fc8b450b64a>
import { ICreateOrUpdateBuilder, sid } from '@aphro/runtime-ts';
import { Context } from '@aphro/runtime-ts';
import { MutationsBase } from '@aphro/runtime-ts';
import Deck from './Deck.js';
import { default as spec } from './DeckSpec.js';
import { Data } from './Deck.js';
import { UpdateMutationBuilder } from '@aphro/runtime-ts';
import { CreateMutationBuilder } from '@aphro/runtime-ts';
import { DeleteMutationBuilder } from '@aphro/runtime-ts';
import { Changeset } from '@aphro/runtime-ts';
import User from './User.js';
import { Data as UserData } from './User.js';
import Slide from './Slide.js';
import { Data as SlideData } from './Slide.js';

export default class DeckMutations extends MutationsBase<Deck, Data> {
  private constructor(ctx: Context, mutator: ICreateOrUpdateBuilder<Deck, Data>) {
    super(ctx, mutator);
  }

  static update(model: Deck) {
    return new DeckMutations(model.ctx, new UpdateMutationBuilder(spec, model));
  }

  static creation(ctx: Context) {
    return new DeckMutations(ctx, new CreateMutationBuilder(spec));
  }

  static deletion(model: Deck) {
    return new DeckMutations(model.ctx, new DeleteMutationBuilder(spec, model));
  }

  create({
    name,
    owner,
    selectedSlide,
  }: {
    name: string;
    owner: User | Changeset<User, UserData>;
    selectedSlide: Slide | Changeset<Slide, SlideData> | null;
  }): this {
    // BEGIN-MANUAL-SECTION
    this.mutator.set({
      id: sid('test'),
      name,
      ownerId: owner.id,
      selectedSlideId: selectedSlide?.id,
    });
    // END-MANUAL-SECTION
    return this;
  }

  selectSlide({ selectedSlide }: { selectedSlide: Slide | Changeset<Slide, SlideData> }): this {
    // BEGIN-MANUAL-SECTION
    // END-MANUAL-SECTION
    return this;
  }

  rename({ name }: { name: string }): this {
    // BEGIN-MANUAL-SECTION
    // END-MANUAL-SECTION
    return this;
  }

  delete({}: {}): this {
    // BEGIN-MANUAL-SECTION
    // END-MANUAL-SECTION
    return this;
  }
}
