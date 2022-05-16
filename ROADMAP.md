1. Perf metrics to figure out where to focus time
   1. Read path?
      1. Joins?
   2. Write path?
      1. Batching?
2. Observability
   1. Instrument various operations so we can understand how the system executes
3. Reactive queries
4. P2P / CRDT support
   1. Add option to schema to mark it as "replicated"
   2. Add option to configure the CRDT to use and clock mechanism
   3. Implement syncing
5. Migrations
   1. Schema fields and edges that encode the semantics of a migration and apply that migration when the underlying data does not match
   2. Dual-writes enabled for the period of migration
6. Traits
   1. Allow schemas to inherit properties from abstract schemas
   2. Allow querying a trait / abstract schema and get all subtypes
7. Polyglot storage
   1. Add another backend (besides SQL), e.g. redis
   2. Test hops across backends (e.g., SQL->Neo hop)
8. Junction Edges
9.  Abstract Edges
10. Neo/Tinkerpop/RedisGraph junction like edge defs
11. Privacy rules
12. Semantic types for fields
13. Deletion behavior encoded into schemas
14. Alert on introduction of non-backwards compatible changes in the schema
15. Plugin framework for integrations like GraphQL or new codegen
16. Polyglot indexing service support
17. Purpose limitation