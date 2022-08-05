---
title: Roadmap
---

Concrete roadmap items are below.

The larger vision and strategy can be found in [[docs/why:Why Aphrodite?]].

Broad set of focus areas, from which these items come, are here [[blog/focus-areas]].

> Dates may slip. We're currently building a set of applications that use Aphrodite in order to make the API less verbose and to deeply understand
> various real-world use cases.

## Current Planned Releases

1. MVP 📦 - July 2022
2. Alpha 💪 - Sep. 2022
3. Beta 🤦‍♂️ - Oct. 2022
4. RC1 🧚‍♀️ - Nov. 2022

Each roadmap item is tagged with the name of the release that will include it.

## Roadmap Items

1. The Schema Definition Language allows defining
   1. ~~(📦 MVP) Nodes & Edges~~ [shipped 🚀]
   2. ~~(📦 MVP) Enumerations~~ [shipped 🚀]
   3. ~~(📦 MVP) Primitive field types~~ [shipped 🚀]
   4. ~~(💪 Alpha) Collection field types~~ [shipped 🚀]
   5. Union edges, union fields
   6. (💪 Alpha) Indices
   7. ~~(📦 MVP) Mutations~~[shipped 🚀]
   8. (💪 Alpha) Permissions
   9.  (💪 Alpha) 3rd party integrations (e.g., GraphQL)
   10. (🧚‍♀️ RC1) Conflict Resolution / CRDTs & Clock Types
       1.  Being worked here: https://github.com/tantaman/conflict-free-sqlite
   11. ~~(🤦‍♂️ Beta) Migrations~~ [shipped 🚀]
2. Runtime Environment & Language Support
   1. ~~(📦 MVP) TypeScript & the browser~~ [shipped 🚀]
   2. ~~(📦 MVP) TypeScript & Node~~ [shipped 🚀]
   3. (🤦‍♂️ Beta) Kotlin & Android
   4. (Post RC1) Swift & iOS
3. Runtime Components
   1. ~~(📦 MVP) Record / Model~~ [shipped 🚀]
   2. ~~(📦 MVP) [[2022-05-26-query-builder:Query builder]]~~ [shipped 🚀]
   3. ~~(📦 MVP) Cache~~ [shipped 🚀]
   4. ~~(📦 MVP) Mutators~~ [shipped 🚀] & transactions
   5. (🧚‍♀️ RC1) P2P Discovery
   6. (🧚‍♀️ RC1) P2P Replication
   7. ~~(🤦‍♂️ Beta) Migrations~~ [shipped 🚀]
   8. (🧚‍♀️ RC1) Permission evaluation
4. Databases & Backends
   1. ~~(📦 MVP) SQLite~~ [shipped 🚀]
   2. (Unplanned) Others? (RocksDB? LevelDB? FoundationDB?)
5. Non Green-Field deployments
   1. (Unplanned) Support field/column storage type overrides
   2. (Unplanned) Support auto-incr primary keys
6. Context
   1. Identity
7. UI
   1. ~~(📦 MVP) React integration~~ [shipped 🚀]
   2. Solid
   3. Svelte