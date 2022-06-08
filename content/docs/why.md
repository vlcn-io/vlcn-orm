---
layout: docs
title: Why Aphrodite
subtitle: the goals of Aphrodite and the problems being solved
---

The ultimate goal of `Aphrodite` is to make [local-first](https://www.inkandswitch.com/local-first/) and [peer-to-peer](https://en.wikipedia.org/wiki/Peer-to-peer) software easier to develop. The `Aphrodite` project has made significant progress to that end but the more progress we make, the more opportunities we see.

A nice feature of the problems & opportunities thus far is that they can be tackled in sequence. Each solution building on the solution before it, each solution making local-first and p2p software a step function easier to develop, and each solution unlocking entirely new capabilities for application developers.

The best way to understand the value of `Aphrodite`, as well as the long term direction of the project, is to understand each of the opportunities that have been identified & the progress made against each.

Opportunities (workstreams):
1. Plurality of client side languages & platforms
2. "ORM" Scope
3. Declarative conflict resolution in a relational world
4. Peer-2-Peer discovery & state replication
5. Permissions in a decentralized world
6. From Schemas to Protocols

## Plurality of client side languages & platforms

The plurality of client side languages and platforms (iOS, Android, Web, desktop, embedded) brings us an opportunity. Projects like [React Native](https://reactnative.dev/) and [Flutter](https://flutter.dev/) have solved the code-reuse problem for UI components but we're still struggling to share business logic and domain models between platforms without moving that code to the server. This makes modern apps nearly impossible to use offline, slow (due to network round trips), and complex (handling network failure, optimistic updates, polling and subscriptions).

`Aphrodite` is designed as a multi-platform `ORM` and `Schema Definition Language`. `Aphrodite` [[docs/schemas:schemas]] are written in a `DSL` which is used to generate code for interacting with and controlling your data model in a given target language.

`Aphrodite`'s MVP targets TypeScript with the next language targets being (in current order of priority):
1. Kotlin
2. Swift
3. Rust

## ORM Scope

`Aphrodite` is really more than an ORM -- ORMs are just what it is most similar to.

ORMs don't go far enough in their scope. Yes, they express your data and relationships between your data but they generally stop there. They could (and should) include any concern that can be expressed declaratively and is a property of the data.

Concerns like:

1. Invariants on the data (consistency rules)
2. Row level read & write permissions (e.g., postgres row level security)
3. Relationship cardinality
4. Allowed mutations
5. Conflict resolution strategy
6. Semantic type(s)

## Declarative conflict resolution

If you're putting your data model on the client with the desire to allow your client to run completely offline for extended periods of time, then re-syncing with other peers or a server when your client is back online -- you need a way to do conflict resolution.

There are many exciting projects in this space
- [automerge](https://automerge.org/)
- [yjs](https://yjs.dev/)
- [GunDB](https://gun.eco/)

`Aphrodite` differentiates itself by supporting relational and graph data models. The other differentiating factor is that `Aphrodite` is not schemaless.

On `Aphrodite`, we believe that schemas are important in order to:
1. Prevent programmer mistakes
2. Provide type safe APIs
3. Detect mismatching (at the schema level) data models between peers
4. Define & enforce invariants on data
5. Enable better understanding of application data

The schema is also where you declare your conflict resolution strategy for a given data type.

## Peer-2-Peer discovery & state replication

## Permissions

## Schemas ... Protocols