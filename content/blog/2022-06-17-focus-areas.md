https://www.youtube.com/watch?v=DEcwa68f-jY

CRDTs and the peer-to-peer aspect are a bit later down the road. The first step is getting the query & mutation layer solid for non-collaborative use cases.

Perf

Monitoring

Bugs

Propery based testing

CRDTs

I've got a few things left open there
- some missing query capabilities like intersecting and unioning queries.



We've just met so I don't know too much about your background, strengths and things you want to learn. Given that, I'll give you an overview of the areas that need work and you can let me know what interests you and we can figure out next steps after that.

# Area 1: Completeness

# Area 2: Portability

Local-first means that your business logic exists on the client, not the server. Existing on the client means you have multiple platforms and languages to target since users have a myriad of devices -- iOS, Android, Desktop, maybe TVs and other things if we become successful enough to be used there too.

The current proof of concept is implemented in TypeScript. This is a portability barrier for those that want to write fully native (e.g., swift/kotlin) apps. I currently see two directions:
1. Port all of the runtime components to Rust so we can compile native libraries in each target platform
2. Do something crazy like writing the runtime in Wax and cross-compiling to Swift/Kotlin/TypeScript

I think (1) is the most reasonable, common and battle tested path.

# Area 3: Production readiness

## Performance metrics
Worrying about perf is often criticised as a premature optimization but when betting on a framework to do all of your data access -- perf is a relevant first thing to look at. I.e., you don't want to put your entire app on framework X only to discover that your query patterns are not and may not ever be supported in a performant manner.

We need to figure out:
1. How well do Aphrodite read queries perform vs raw SQL?
   1. We'll have to enumerate all the various query types (filters, pagination, ordering, single hop, multi-hop, etc.) and gather metrics on them.
2. Writes?
   1. We'll also need to dig into perf of potimistic writes
3. Batch operations
4. How well does it perform in the browser vs other environments?

This isn't incredibly high priority right now but I think having these numbers will
1) help guide development and
2) be of interest to potential adopters

## Monitoring
Running a system blind / w/o minotring is as bad as never testing the system. You don't _really_ know what is going on or how the system
behaves under real use cases until your add monitoring. Monitoring in this case being counting of what operations are happening & how often.
How big caches become, what the cache hit rate is, etc.

Basically we'd need to go through each component and figure out what are the important metrics to gather for that component which will tell us whether
or not it is behaving as expected.

