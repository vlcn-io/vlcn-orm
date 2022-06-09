// SIGNED-SOURCE: <897319f9afff7311f31c4ec6d368655a>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import { CreateArgs } from './UserMutations.js';
import { RenameArgs } from './UserMutations.js';
import { DeleteArgs } from './UserMutations.js';
import { Changeset, sid } from '@aphro/runtime-ts';
import { Data } from './User.js';
import User from './User.js';
import { IMutationBuilder } from '@aphro/runtime-ts';

export default {
  create(
    mutator: Omit<IMutationBuilder<User, Data>, 'toChangeset'>,
    { name }: CreateArgs,
  ): void | Changeset<any>[] {
    mutator.set({
      id: sid('test'),
      name,
      created: Date.now(),
      modified: Date.now(),
    });
  },

  rename(
    mutator: Omit<IMutationBuilder<User, Data>, 'toChangeset'>,
    { name }: RenameArgs,
  ): void | Changeset<any>[] {
    mutator.set({
      name,
    });
  },

  delete(
    mutator: Omit<IMutationBuilder<User, Data>, 'toChangeset'>,
    {}: DeleteArgs,
  ): void | Changeset<any>[] {
    // Use the provided mutator to make your desired changes.
    // e.g., mutator.set({name: "Foo" });
    // You do not need to return anything from this method. The mutator will track your changes.
    // If you do return changesets, those changesets will be applied in addition to the changes made to the mutator.
  },
};
