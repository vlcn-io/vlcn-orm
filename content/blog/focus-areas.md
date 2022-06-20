Draft / wip list of focus areas. Pre-published to allow potential contributors to find areas of potential interest.

# Area 1: ORM Table Stakes

ORM Table Stakes is about having the "expected" features of a data access layer. In addition, users should never be slowed down by the ORM. Hard things are made easy, impossible things are made possible. The ORM always feels like a helper and never a blocker.

**Table stakes / required featuers:**
- Querying (join/hop, count, filter, order by, union, map, intersect, filter, where exists, id & count projections, fetch & traverse hops)
- Aggregations (group)
- Migrations (versioned schemas, auto-generated alter tables, support for migration scripts)
- Bootstrapping (table creation, migration application)
- Seeding (automatic example data creation based on defined schemas)
- Mutations (batched, transactional)

# Area 2: Exceeding ORM Expectations

ORMs are leaving a bunch of scope on the table in terms of what they can unlock for users. See my draft [protocol for integrations](https://github.com/tantaman/tantaman.github.io/blob/master/_drafts/2022-01-26-protocol-for-integrations.markdown) post.
This focus area is about moving into those and unlocking that value.

- Reactive queries (post)
- Extensions (schema definition language & codegen can be extended by third parties to support things like GraphQL, Thrift, Block Protocol, Feature Extraction, etc.)
- Object, field & edge level permissions (post)
- P2P Permissions (see Area 6)
- Semantic types (see "these are not types" post)
- Object binding (post)

# Area 3: Runtime Portability

Local-first means that your business logic exists on the client, not the server. Existing on the client means you have multiple platforms and languages to target since users have a myriad of devices -- iOS, Android, Desktop, maybe TVs, edge devices and other things.

The current proof of concept is implemented in TypeScript. This is a portability barrier for those that want to write fully native (e.g., swift/kotlin) apps. I currently see two options:
1. Port all of the runtime components to `Rust` so we can compile the runtime to native libraries in each target platform
2. Do something crazy like writing the runtime in [Wax](https://github.com/LingDong-/wax) and cross-compiling to Swift/Kotlin/TypeScript

I think (1) is the most reasonable, common and battle tested path.

# Area 4: Production readiness

## Performance metrics
Worrying about perf is often criticised as a premature optimization but when betting on a framework to do all of your data access -- perf is a relevant first thing to look at. I.e., you don't want to put your entire app on framework X only to discover that your query patterns are not and may not ever be supported in a performant manner.

We need to figure out:
1. How well do Aphrodite read queries perform vs raw SQL?
   1. We'll have to enumerate all the various query types (filters, pagination, ordering, single hop, multi-hop, etc.) and gather metrics on them.
2. Writes
   1. We'll also need to dig into perf of potimistic writes
3. Batch operations
4. How well does it perform in the browser vs other environments?

This isn't incredibly high priority right now but I think having these numbers will

1. help guide development and
2. be of interest to potential adopters

## Monitoring
Running a system blind / w/o minotring is as bad as never testing the system. You don't _really_ know what is going on or how the system
behaves under real use cases until your add monitoring. Monitoring in this case being counting of what operations are happening & how often.
How big caches become, what the cache hit rate is, runtime exceptions, etc.

We need to go through each component and figure out what are the important metrics to gather for that component which will tell us whether
or not it is behaving as expected.

## Property Based Testing

Property based testing is about ensuring certain properties hold rather than testing on specific examples. Some background here: https://increment.com/testing/in-praise-of-property-based-testing/

Some test in the codebase are property based using [fast-check](https://github.com/dubzzz/fast-check). More of the query layer, query planner, specAndOpsToSQL, need property based tests to flex all possible inputs in terms of query operators and field types.

# Area 5: Peer 2 Peer

Local-first vs cloud-centric are two poles on a spectrum. If we go 100% local-first, there's no central server at all and devices update one another in a peer-to-peer fashion.

The closer to that end we get the more this --

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

TODO -- fill this in on the rationale of why we need this and when we'll get here.

**Logical clock basics**

Clocks are needed to give changes a causal or "happens before" relationship. When changes can happen on different peers, physical clocks can no longer do the trick. This is because clock-skew is a very real and common problem -- even on local networks leveraging NTP (http://www.ntp.org/).

Below are some resources on clocks (todo: document tradeoffs of each) --

* [Lamport Clock](https://martinfowler.com/articles/patterns-of-distributed-systems/lamport-clock.html)
* [Hybrid Logical Clock](https://martinfowler.com/articles/patterns-of-distributed-systems/hybrid-clock.html)
* [Vector Clock](https://en.wikipedia.org/wiki/Vector_clock#:~:text=A%20vector%20clock%20is%20a,the%20sending%20process's%20logical%20clock.)

After we can order events, we need to know how to merge data updates in a way that all peers will converge to the same state. This is where CRDTs come in. If you're familiar with Abstract Algebra -- if a data structure forms a semi-lattic under a join (merge) operation, it is guaranteed to converge. TODO -- flesh this out much more.

**CRDT Basics**
* https://bartoszsypytkowski.com/the-state-of-a-state-based-crdts/
* https://crdt.tech/

**Document based CRDTs**
* https://github.com/automerge/automerge
* https://yjs.dev/
  * https://bartoszsypytkowski.com/yata/

**Graph? Based**
* https://gun.eco/

**Relational CRDTs**
* https://www.youtube.com/watch?v=DEcwa68f-jY
* https://munin.uit.no/bitstream/handle/10037/22344/thesis.pdf?sequence=2
* https://hal.inria.fr/hal-02983557/document
* https://www.researchgate.net/publication/353813091_Augmenting_SQLite_for_Local-First_Software

# Area 6: P2P With Collaboration

P2P is one thing -- P2P where you can invite collaborators and hide/share different pieces of data with them is another.

The first thing we need is to provde identity without a central server to verify identity.

Potential foundations:
- [User Controller Authorization Networks](https://ucan.xyz/)
- [Decentralized Identifiers](https://www.w3.org/TR/did-core/)

After identity is solved, permission management is the next issue. We'll leverage the [permission framework built into the foundation of the ORM](https://www.w3.org/TR/did-core/) from area 2.

The current hypothesis is that we can handle permissions at the point of replication.

**Example:**

If I share X with read permissions with you then X can be replicated to you from my local app. If I share X with write permissions with you then my local app will apply updates to X that come from you.

There are some user expectation problems to solve --
Once you've receive X from me does that then retain my original permissions? Can you change the permissions?

And then two areas to design for:
1. where we trust those that we share our data with
2. where we may not trust those that we share our data with

We'll solve for (1) first.

# Area 7: Speculation

- Allowing local applications to share data with other local applications
  - [Block protocol](https://blockprotocol.org/) integrations
  - The semantic type layer from area 2 becomes important here