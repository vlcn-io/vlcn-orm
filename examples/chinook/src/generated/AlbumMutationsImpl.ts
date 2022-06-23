import { CreateArgs } from './AlbumMutations.js';
import { RetitleArgs } from './AlbumMutations.js';
import { Changeset } from '@aphro/runtime-ts';
import { Data } from './Album.js';
import Album from './Album.js';
import { IMutationBuilder, sid } from '@aphro/runtime-ts';
import deviceId from '../deviceId.js';

export function createImpl(
  mutator: Omit<IMutationBuilder<Album, Data>, 'toChangeset'>,
  { title, artist }: CreateArgs,
): void | Changeset<any>[] {
  mutator.set({
    id: sid(deviceId),
    title,
    artistId: artist.id,
  });
}

export function retitleImpl(
  mutator: Omit<IMutationBuilder<Album, Data>, 'toChangeset'>,
  { title }: RetitleArgs,
): void | Changeset<any>[] {
  mutator.set({ title });
}
