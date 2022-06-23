import { CreateArgs } from './MediaTypeMutations.js';
import { RenameArgs } from './MediaTypeMutations.js';
import { Changeset } from '@aphro/runtime-ts';
import { Data } from './MediaType.js';
import MediaType from './MediaType.js';
import { IMutationBuilder, sid } from '@aphro/runtime-ts';
import deviceId from '../deviceId.js';

export function createImpl(
  mutator: Omit<IMutationBuilder<MediaType, Data>, 'toChangeset'>,
  { name }: CreateArgs,
): void | Changeset<any>[] {
  mutator.set({
    id: sid(deviceId),
    name,
  });
}

export function renameImpl(
  mutator: Omit<IMutationBuilder<MediaType, Data>, 'toChangeset'>,
  { name }: RenameArgs,
): void | Changeset<any>[] {
  mutator.set({
    name,
  });
}
