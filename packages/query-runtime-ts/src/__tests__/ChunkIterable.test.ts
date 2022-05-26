import { emptyChunkIterable, StaticSourceChunkIterable } from '../ChunkIterable';
import fc from 'fast-check';

test('Empty chunk iterable is empty', async () => {
  expect(await emptyChunkIterable.gen()).toEqual([]);
  let hadChunk = false;
  for await (const chunk of emptyChunkIterable) {
    hadChunk = true;
  }

  expect(hadChunk).toBe(false);
});

test('Static source chunk iterable returns its input', () => {
  fc.assert(
    fc.asyncProperty(fc.array(fc.array(fc.string())), async chunks => {
      const iterable = new StaticSourceChunkIterable(chunks);
      expect(await iterable.gen()).toEqual(chunks.flatMap(a => a));

      let i = 0;
      for await (const chunk of iterable) {
        expect(chunk).toEqual(chunks[i]);
        ++i;
      }
    }),
  );
});

test('Mapping chunk iterables', () => {
  fc.assert(
    fc.asyncProperty(fc.array(fc.array(fc.string())), async chunks => {
      const iterable = new StaticSourceChunkIterable(chunks).mapAsync(async x => x + '-mapped');
      expect(await iterable.gen()).toEqual(chunks.flatMap(a => a).map(a => a + '-mapped'));

      let i = 0;
      for await (const chunk of iterable) {
        expect(chunk).toEqual(chunks[i].map(x => x + '-mapped'));
        ++i;
      }
    }),
  );
});

test('Filtering chunk iterables', () => {
  fc.assert(
    fc.asyncProperty(fc.array(fc.array(fc.string())), async chunks => {
      const iterable1 = new StaticSourceChunkIterable(chunks).filter(x => false);
      const iterable2 = new StaticSourceChunkIterable(chunks).filterAsync(async x => false);

      const check = async iterable => {
        expect(await iterable.gen()).toEqual([]);

        let hadChunk = false;
        for await (const chunk of iterable) {
          hadChunk = true;
        }

        expect(hadChunk).toBe(false);
      };

      await check(iterable1);
      await check(iterable2);
    }),
  );
});
