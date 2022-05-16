1. Perf metrics to figure out where to focus time
   1. Read path?
      1. Joins?
   2. Write path?
      1. Batching?
2. Observability
   1. Instrument various operations so we can understand how the system executes
3. Reactive queries
4. Migrations
   1. Schema fields and edges that encode the semantics of a migration and apply that migration when the underlying data does not match
   2. Dual-writes enabled for the period of migration
5. Traits
   1. Allow schemas to inherit properties from abstract schemas
   2. Allow querying a trait / abstract schema and get all subtypes
6. Polyglot storage
   1. Add another backend (besides SQL), e.g. redis
   2. Test hops across backends (e.g., SQL->Neo hop)
7. Junction Edges
8. Abstract Edges
9. Neo/Tinkerpop/RedisGraph junction like edge defs
10. Privacy rules
11. Semantic types for fields
12. Deletion behavior encoded into schemas
13. Alert on introduction of non-backwards compatible changes in the schema
14. Plugin framework for integrations like GraphQL or new codegen
15. Polyglot indexing service support
16. Purpose limitation