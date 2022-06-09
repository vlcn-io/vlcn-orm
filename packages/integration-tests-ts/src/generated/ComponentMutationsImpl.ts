// SIGNED-SOURCE: <d309e1d6d17a4e3afd430d61f4da6d09>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import { CreateArgs } from './ComponentMutations.js';
import { DeleteArgs } from './ComponentMutations.js';
import { Changeset, sid } from '@aphro/runtime-ts';
import { Data } from './Component.js';
import Component from './Component.js';
import { IMutationBuilder } from '@aphro/runtime-ts';

export default {
  create(
    mutator: Omit<IMutationBuilder<Component, Data>, 'toChangeset'>,
    { subtype, slide, content }: CreateArgs,
  ): void | Changeset<any>[] {
    mutator.set({
      id: sid('test'),
      subtype,
      slideId: slide.id,
      content,
    });
  },

  delete(
    mutator: Omit<IMutationBuilder<Component, Data>, 'toChangeset'>,
    {}: DeleteArgs,
  ): void | Changeset<any>[] {},
};
