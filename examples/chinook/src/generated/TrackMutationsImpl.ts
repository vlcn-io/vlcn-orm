import { CreateArgs } from './TrackMutations.js';
import { Changeset } from '@aphro/runtime-ts';
import { Data } from './Track.js';
import Track from './Track.js';
import { IMutationBuilder, sid } from '@aphro/runtime-ts';
import deviceId from '../deviceId.js';

export function createImpl(
  mutator: Omit<IMutationBuilder<Track, Data>, 'toChangeset'>,
  { name, album, mediaType, genre, composer, milliseconds, bytes, unitPrice }: CreateArgs,
): void | Changeset<any>[] {
  mutator.set({
    id: sid(deviceId),
    name,
    albumId: album.id,
    mediaTypeId: mediaType?.id,
    genreId: genre?.id,
    composer,
    milliseconds,
    bytes,
    unitPrice,
  });
}
