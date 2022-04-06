# Beautiful Schemas

**Schema ->**
  * Objects & Classes
  * DB
  * GraphQL
  * Loggers
  * Lineage
  * [Privacy](https://entgo.io/docs/privacy)
  * [Purpose Limitation](https://gist.github.com/tantaman/bd928ef93619e73365b07899da282996#policies--purpose-use)
  * Security
  * Reactivity
  * Trust & Safety (e.g., abuse protection)
  * [Semantic type information](https://tantaman.com/2020-05-19-These-Are-Not-Types/)
  * [Link traversal, fetching, mutations](https://blockprotocol.org/)
  * [Goal based integrations of systems](https://www.youtube.com/watch?v=8pTEmbeENF4&t=687s)

# Vision

Today's `ORMs` and `Schemas` suffer. They suffer from being tied to a single language, being tied to the relational model, expressing storage (rather than semantic) types, not enabling us to colocate security and privacy concerns with the data being stored, not being extensable to express all future concerns that center around data. E.g., indexing concerns, caching, reactivity / subscriptions, sharding, abuse protection and so on.

## Beyond Language

Today's ORMs are tied to a language. Write an ORM Schema in `JS`, re-write it for another ORM in `Java` and another in `Go` and another in `Rust`.

We live in a world where are applications are written in many languages. Schema definitions must be language agnostic. Agnostic in that they can generate object models in any target language you desire.

Write your Schema once, generate the object models in `Rust`, `JS`, `Java`, `Go`, etc.

## Beyond Relational

`SQL` isn't the only backend. `ORM`s must go beyond the "R" (relational) in ORM.

Our applications, in addition to being a collection of languages, are a collection of storage mediums. Blob stores, Document Stores, Graph stores, custom binary formats to legacy storage backends and services, etc.

Not all of these mediums are relational nor do they all speak `SQL`.

Our schemas should be able to generate code that can query into other storage layers and seamlessly link them together.

E.g.,
```
user.queryRecentUploads().queryAccessLogs()
```

The above example would start from a `User` object from our `SQL` database, query their uploads in our blob storage system, query the related logs in our access log cache.

## Beyond Storage Types

Today's schemas don't provide enough information. `varchar`, `bool`, `bigint`, these are all storage types. We need these for the databse but our application layer needs semantic inforamtion. Is that `bigint` a measure? A count? An ID? If any of those, then a count / measure / id of what?

## Beyond Controller Privacy

Why do we still try to enforce security at the controller level? This is plain crazy.

You need to protect the data. The permission model should sit with the data. Someone wants to load a private message? That private message should know who its sender and recipients are and whether or not the viewer is one of those. This should be expressed in the schema that describes the data, not in one of the dozes or hundreds of random controllers that load the data.
