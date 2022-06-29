// SIGNED-SOURCE: <2b9f58e529eadc77febc3d69a24f83bd>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import * as impls from './SlideMutationsImpl.js';
import { ICreateOrUpdateBuilder } from '@aphro/runtime-ts';
import { Context } from '@aphro/runtime-ts';
import { MutationsBase } from '@aphro/runtime-ts';
import Slide from './Slide.js';
import { default as spec } from './SlideSpec.js';
import { Data } from './Slide.js';
import { UpdateMutationBuilder } from '@aphro/runtime-ts';
import { CreateMutationBuilder } from '@aphro/runtime-ts';
import { DeleteMutationBuilder } from '@aphro/runtime-ts';
import { SID_of } from '@aphro/runtime-ts';
import { Changeset } from '@aphro/runtime-ts';
import Deck from './Deck.js';
import { Data as DeckData } from './Deck.js';

export type CreateArgs = {
  deck: Deck | Changeset<Deck, DeckData>;
  order: number;
};

export type ReorderArgs = { order: number };

export type DeleteArgs = {};
class Mutations extends MutationsBase<Slide, Data> {
  constructor(ctx: Context, mutator: ICreateOrUpdateBuilder<Slide, Data>) {
    super(ctx, mutator);
  }

  create(args: CreateArgs): this {
    const extraChangesets = impls.createImpl(this.mutator, args);
    this.mutator.addExtraChangesets(extraChangesets || undefined);
    return this;
  }

  reorder(args: ReorderArgs): this {
    const extraChangesets = impls.reorderImpl(this.mutator, args);
    this.mutator.addExtraChangesets(extraChangesets || undefined);
    return this;
  }

  delete(args: DeleteArgs): this {
    const extraChangesets = impls.deleteImpl(this.mutator, args);
    this.mutator.addExtraChangesets(extraChangesets || undefined);
    return this;
  }
}

export default class SlideMutations {
  static create(ctx: Context, args: CreateArgs): Mutations {
    return new Mutations(ctx, new CreateMutationBuilder(spec)).create(args);
  }
  static reorder(model: Slide, args: ReorderArgs): Mutations {
    return new Mutations(model.ctx, new UpdateMutationBuilder(spec, model)).reorder(args);
  }
  static delete(model: Slide, args: DeleteArgs): Mutations {
    return new Mutations(model.ctx, new DeleteMutationBuilder(spec, model)).delete(args);
  }
}
