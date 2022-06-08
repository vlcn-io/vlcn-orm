---
title: Roadmap
---

Concrete roadmap items are below. The larger vision and strategy can be found in [[docs/why:Why Aphrodite?]].

## Current Planned Releases

1. MVP 📦
2. Alpha 💪
3. Beta 🤦‍♂️
4. RC1 🧚‍♀️

Each roadmap item is tagged with the name of the release that will include it.

## Roadmap Items

1. The Schema Definition Language allows defining
   1. (📦 MVP) Nodes & Edges
   2. (📦 MVP) Enumerations
   3. (📦 MVP) Primitive field types
   4. (💪 Alpha) Collection field types
   5. (💪 Alpha) Indices
   6. (📦 MVP) Mutations
   7. (🤦‍♂️ Beta) Permissions
   8. (💪 Alpha) 3rd party integrations (e.g., GraphQL)
   9. (🧚‍♀️ RC1) Conflict Resolution / CRDTs & Clock Types
   10. (🤦‍♂️ Beta) Migrations
2. Runtime Environment & Language Support
   1. (📦 MVP) TypeScript & the browser
   2. (💪 Alpha) Vanilla JS & Node
   3. (🤦‍♂️ Beta) Kotlin & Android
   4. (Post RC1) Swift & iOS
3. Runtime Components
   1. (📦 MVP) Record / Model
   2. (📦 MVP) [[2022-05-26-query-builder:Query builder]]
   3. (📦 MVP) Cache
   4. (📦 MVP) Mutators & transactions
   5. (🧚‍♀️ RC1) P2P Discovery
   6. (🧚‍♀️ RC1) P2P Replication
   7. (🤦‍♂️ Beta) Migrations
   8. (🧚‍♀️ RC1) Permission evaluation
4. Databases & Backends
   1. (📦 MVP) SQLite
   2. (💪 Alpha) Postgres
   3. (🧚‍♀️ RC1) Polyglot persistence & edges between data stores
   4. (Unplanned) Cypher? Redis?
   5. (Unplanned) Sharded SQL
   6. (Unplanned) Custom & arbitrary services (Rest / Thrift / etc.)
5. Non Green-Field deployments
   1. Support field storage overrides
   2. Support auto increment ids
   3. Support id providers (e.g., uuid)
6. Context
   1. Identity