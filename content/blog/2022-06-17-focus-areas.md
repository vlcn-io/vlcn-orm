# Area 1: ORM Table Stakes

This is about having the "expected" features of a data access layer. Users should never be slowed down by the ORM. Hard things are made easy, impossible things are made possible. The ORM always feels like a helper and never a blocker.

**Table stakes:**
- Querying (join, count, filter, order by, union, map, intersect, filter, where exists, id & count projections)
- Migrations (versioned schemas, auto-generated alter tables, support for migration scripts)
- Bootstrapping (table creation, migration application)
- Seeding (automatic example data creation based on defined schemas)
- Mutations (batched, transactional)

# Area 2: Exceeding ORM Expectations

ORMs are leaving a bunch of scope on the table in terms of what they can unlock for users. See my draft "protocol for integrations" post.
This focus is about moving into those and unlocking that value.

- Reactive queries (post)
- Extensions (schema definition language & codegen can be extended by third parties to support things like GraphQL, Thrift, Block Protocol, Feature Extraction, etc.)
- Object, field & edge level permissions (post)
- Semantic types (see "these are not types" post)
- Object binding (post)

# Area 3: Portability

Local-first means that your business logic exists on the client, not the server. Existing on the client means you have multiple platforms and languages to target since users have a myriad of devices -- iOS, Android, Desktop, maybe TVs and other things if we become successful enough to be used there too.

The current proof of concept is implemented in TypeScript. This is a portability barrier for those that want to write fully native (e.g., swift/kotlin) apps. I currently see two directions:
1. Port all of the runtime components to `Rust` so we can compile native libraries in each target platform
2. Do something crazy like writing the runtime in Wax and cross-compiling to Swift/Kotlin/TypeScript

I think (1) is the most reasonable, common and battle tested path.

# Area 4: Production readiness

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

## Property Based Testing

## Bug Squashing

# Area 5: Peer 2 Peer

The dream is to get rid of the server and allow devices to update one another in a peer 2 peer fashion. This

1. Reduces cloud costs
2. Increases user security as data can be made to never leave their local networks
3. Enables leveraging the endless amount of idle compute and storage out there on consumer devices
4. Improves longevity of data

There two problems that need to be solved to make this a reality.

## Discovery

Peers need a way to discover one another and then connect to one another. Traditionally this is done via relay servers (e.g., web RTC).

Other things that exist in this space and need to be researched:
- https://hypercore-protocol.org/
- [Matrix](https://matrix.org/)
- Smart contracts?

## Conflict Resolution

Document based
* https://github.com/automerge/automerge
* https://yjs.dev/

Graph? Based
* https://gun.eco/

Relational
* https://www.youtube.com/watch?v=DEcwa68f-jY
* https://munin.uit.no/bitstream/handle/10037/22344/thesis.pdf?sequence=2
* https://hal.inria.fr/hal-02983557/document
* https://www.researchgate.net/publication/353813091_Augmenting_SQLite_for_Local-First_Software
* 
