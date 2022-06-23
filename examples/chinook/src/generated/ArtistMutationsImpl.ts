import { CreateArgs } from './ArtistMutations.js';
import { RenameArgs } from './ArtistMutations.js';
import { Changeset } from '@aphro/runtime-ts';
import { Data } from './Artist.js';
import Artist from './Artist.js';
import { IMutationBuilder, sid } from '@aphro/runtime-ts';
import deviceId from '../deviceId.js';

export function createImpl(
  mutator: Omit<IMutationBuilder<Artist, Data>, 'toChangeset'>,
  { name }: CreateArgs,
): void | Changeset<any>[] {
  mutator.set({
    id: sid(deviceId),
    name,
  });
}

export function renameImpl(
  mutator: Omit<IMutationBuilder<Artist, Data>, 'toChangeset'>,
  { name }: RenameArgs,
): void | Changeset<any>[] {
  mutator.set({
    name,
  });
}
