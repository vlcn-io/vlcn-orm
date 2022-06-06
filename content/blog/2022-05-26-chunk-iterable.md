---
title: '🪨 Chunk Iterable'
tags: [software-engineering, aphrodite]
---

Today I'll be discussing the [`Chunk Iterable Framework`](https://github.com/tantaman/aphrodite/blob/main/packages/query-runtime-ts/src/ChunkIterable.ts). This is a core component of [Aphrodite](http://aphrodite.sh) and is used to speed up the processing of data returned by queries.

The main idea behind a chunk iterable is to be able to iterate over some source of data in chunks. Why would we want to iterate over a data source in chunks?

Mainly for performance. Imagine you have an unbounded stream of data. There are two options for processing this data that exist on a spectrum.

- Option 1: Process everything in the stream all at once.
- Option 2: Process a single item from the stream at a time.

If the source is unbounded (or larger than your working memory), Option 1 is not possible.

Option 2 is always possible but can be slow. Option 2 is like making 10,000 individual trips to the store to pick up 10,000 packs of m&ms. You probably can't fit 10,000 packs of m&ms in a single tripe but you could get a chunk of 500 packs in a single trip, reducing your total trips from 10,000 to 20.

`ChunkIterable` is the same. If a data source could return a massive amount of data, `ChunkIterable` streams the results back in chunks. This strikes a nice balance between batch processing and not overwhelming your local resources.

`ChunkIterable`, conforming to an `Iterable` interface, also allows you to perform operations like `filter` & `map` against chunks.

This is important for `Aphrodite` as `Aphrodite` uses `map` to turn a raw data stream into models and uses `filter` to apply filters to streams that couldn't be hoisted to the database layer.
