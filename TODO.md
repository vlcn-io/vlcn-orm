# 5/22
- Create from data, re-hydrate cache?
- Auto-generate ID on create -- depending on id type...
- ~~Promise subclass~~
- Switch to nanoid #22
- 'merge' codegen option
- ~~Preserve manual sections~~
- ~~prettier ignore partially generated code~~
  - Will need to suggest that users ignore `generated` folders
- Test error paths, smooth error messages
- 1+N query problem solution
- bi-directional references... when creating objects that point to one another?

- Type validation on referenced types
  - Imports
- Back to tailer architecture for persister?
  - Would bring consistency to persist and replication.
- Discord setup
- hop queries e2e test
- devex on returns from mutations
- Revisit log and tail infra for persistence
- Actually start a transaction for your commit mutations in `persistor`
- ~~Mutator devx. "create.create" :/ "delete.delete"~~
- sqljs knex poc - https://github.com/gammaql/greldal/blob/20f65226256ec217ea056bf7e0c1eca48b5bb721/src/docs/utils/SQLJSClient.js
  - https://gammaql.github.io/greldal/playground
- investigate sqlite reactivity
- Extending available semantic types?? E.g., PhoneNumber. Does this always need to be a grammar extension or can we do something simpler?
  - "Semantic<ArbitraryName> & Storage<StorageType>" -- what does this mean for codegen?
  - Semantics generate type aliases? Should schema author be able to define the alias so storage doesn't have to continually
    - be specified?
- Anything we can leverage from json-schema? E.g., validator generation

# 5/19
- Enable references to uncreated things for mutations.
- Creation and update mutation should never return null on optomistic

# 5/16

- incorporate zod for schemas and test generation?
- ensure the cache we're using is pegged to the right viewer??
- generate static query all method for node classes
- in spec.createFrom -- check cache first and either
  - return cached value or merge into cache and return cached value?
- Are query all methods re-hydrating the cache on return?
- ~~TS Runtime that just includes everything needed for TS in 1 package~~
- ~~Install cli as bin~~
- ~~Inject context into mutations~~
- ~~Add delete to mutations. E.g., `for` and `delete`~~
- ~~Return some ids so we can gain access to persisted models.. if so desired..~~
  - Mainly useful for create
  - Update is technically immediately reflected
- Tighten up package interfaces?
  - Don't export ChangesetExecutor or Persistor? Only commit?

# 5/13

- ~~CS executor... keep commit log reference?~~
  - ~~Well... we need direct persistor reference...~~
- Make `_` methods in `Model.ts` local to packages that need them via type extensions from foreign packages.

# 5/6
- ~~re-work create tables? Use Knex? Or Use files? def. re-work for testing -- test infra should not require sql files~~
- fix react hooks `// TODO: uncomment once we fix the models back up`

- ~~context thread thru and everywhere?~~
- ~~changesetExecutor fixup~~
- ~~mutator import~~
- ~~use writer from p2p~~
- ~~cache in context? e.g., request context~~
  - ~~viewer in context... / thread context thru~~
- ~~sid cast operation and sid create operation~~


Integrations removed in commit:
https://github.com/tantaman/aphrodite/commit/e36b61764de86aff0c7eddcdbd9ba6919819ccaa

# Spec & Persist

Persist, Data<D>...
`Spec` should include `toStorage` and `fromStorage`
D doesn't need to match the on disk format.


# Client / Server model split --
Writes are easy. All point writes allowed. Can send a batch of validated point writes from the client.
Server should always check authz policies. Optionally re-do validation.

Reads are harder. We don't want to build and send raw SQL but rather just query plans.
We also want to build an allow-list of query plans to accept. E.g., persisted queries.

Write authz checked at persist time.
Read authz checks at load time.

Persist in mutator.
Load in model `createFromData`

- TRPC.io? as our transport rather than anything GraphQL like?
- pluggable grammar

e.g.,
interface Extension {
  grammar(): string {

  }

  actions(): SemanticActions {

  }

  condensor(): Condensor {

  }
}

- custom storage, custom loaders, in-memory only models, thrift models, block protocol extension?

and re-write Mutations, OutboundEdges, InboundEdges, Index, etc. in this format.

- computed props
  - triggers
  - declarative computations
- dsl comments
- nullability
- virtual edges / functions...
- custom fields and edges?
- parametrizied fields and edges?
- object, field and edge privacy?

- prescriptive types for ids and id fields and fk fields
- db resolution from name
- Fluent API for codegen and better handling of tsimport (e.g., .js , ./ concatenation)
- Strike unused imports
- Allow imports in schema files
- Pass around loaded schema list so we can validate edges point to real things
- re-visit EdgeFn and NodeFn functions
- Implement junction edge support
- Implement edge reference declarations and edge data
- Implement validation
- Implement queryAll
- Implement migrations feature?
- Add neo4j support?
- Implement traits
- Add comment support to the DSL
- Write folders in output path that don't exist


# Implementing Traits

Field edge to a trait... this would mean we'd need to check all tables that could hold a user of said trait.
and thus all users of the trait would _have_ to be of the same storage engine.

Now how would we correctly do the model load to the concrete trait type?


```aphro
Component as NodeTrait {
  slideId: ID<Slide>
}

TextComponent as Node {
  id: ID<TextComponent>
  content: string
} & Traits {
  Component
}

& Immutable & Computed { onCreate(now()) }
& Computed { onModify(now()) }

allow typeof operators? typeof Component.subtype
```

# Fixup Postgres table generation

```sql
CREATE TABLE public."User"
(
    id bigint NOT NULL,
    name text NOT NULL,
    created timestamp without time zone NOT NULL,
    modified timestamp without time zone NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE public."Deck"
(
    id bigint NOT NULL,
    name text NOT NULL,
    created timestamp without time zone NOT NULL,
    modified timestamp without time zone NOT NULL,
    "ownerId" bigint NOT NULL,
    "selectedSlideId" bigint,
    PRIMARY KEY (id)
);

CREATE TABLE public."Slide"
(
    id bigint NOT NULL,
    "deckId" bigint NOT NULL,
    "order" double precision NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
);
```

https://codetabs.com/count-loc/count-loc-online.html