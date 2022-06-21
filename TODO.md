# From quickstart
- update imports for mutation impls

# Interesting
- Counter / observability extension
- Absurd SQL debug extension (e.g., inspect tables)

# API Problems
- Using mutations within mutations and gathering all changesets together while still allowing chaining
- Reading already queried edges
  - Sync if it is fulfilled? Still async but have a query cache?
- Device ids in context?
- Context creation / configuration seems bloated
  - Cache could be auto-generated on a per user basis when creating a context.
    - When do we drop a user's cache?
- Migration / table schema conflict errors are not surfaced well
- "subscribing" to a model itself -- and/or the keys on it you care about.
  - This was fine in Strut with just you.. but will others understand it?
    - `useBind([p1, p2, p3], model);`
      - mutators that signal solid signals?
    - What about computed props or functions against the model?
      - Sub to the whole thing I suppose.
    - All model props are getters so you could technically understand what props a function against that model uses.
    - Maybe we go `solidjs` first?
- Auto-build of schemas?
  - Better working of partially generated files and auto-completed imports..
- Use `infer` keyword more to reduce number of generics required
  - See the commit that added this line
- Access to model in mutator for updates
- Default to always applying an order by id if no ordering exists -- stable results.
- map, union, intersect, filter, etc. on QueryBase
- generated ids are not being converted to hex representations and ints on storage?
- Support edge queries?? RN we just traverse edges rather than allowing returning of edge data (if it exists).
- typename and package scoped id suffix for caching? E.g., if someone wants auto-incr (not globally unique) primary keys

# Mutator improvements
- infer what the user wants to write in the manual section and generate that
- Is your `sid` generator actually outputting hex? Why is the `fixme` string showing up? lulz

# Instrumentation
- Incorporate counter in places where we subscribe (e.g., LiveResult) to ensure 0 memory leaks
- Inspect and add logging (counters) for noop mutations being correctly ignored.

# Validator!
- validate engine, edges, type, db, indices...
  - Missing `engine` or wrong `engine` doesn't throw rn

# Migrations
- Food for thought
  - https://gist.github.com/YannickGagnon/5320593
- Add version param on schemas
- Check current app version against persisted version at startup, warn on deltas.
- Diff schema version to generate alter table commands

# Marketing Integrations
- https://steampipe.io/
  - TypedPipe

# Top:
- Ordering of properties on reads and writes (values statement write the right cols, returned rows map to right json keys)
- Migration error messages
- @databases, postgres
- Auto-create IDs for create mutations
- Mutations in mutations
- Circular reference support in mutations
- Codegen and imports ... and maybe using traits to get rid of manual sections / partially generated files
- "unable to find manual section for ..."
- Instrumentation tasks
- Allow index constraints!
- Allow docstrings for fields and node and edges!
- Test for cache population on read & write (createFrom was not doing so)
- - id of imports for mutation args

# 6/16
- tests for specAndOpsToQuery
- tests for chunk iterable additions
- tests for SQLExpression addition
- i.e., tests for commits of today

# 6/14
- Bootstrap generation
- Allow no args to sid for deviceid
- Test handling of unhoisted ops
- SID storage as bigint
  - https://stackoverflow.com/questions/19784491/opposite-of-hex-in-sqlite
  - We can `unhex` or `X"..."` it to get it to a bigint?
- ~~Type system cleanup relative to https://www.sqlite.org/datatype3.html~~
- Index configs
- Validate foreign key indices exist
- Jx edge support
- ~~ID_of imports for mutations~~
- Migrations
- Base query methods
- Context should be passed through to mutator impls
  - Users should be able to extend context with own props
- Ensure cache always matches viewer
- Blog on caching and cache configuration (per request, per session, per viewer, combos, read thru, write thru, nuke on write, etc.)
- Namespace the things in the `runtime-ts` pkg

- String lengths (for gensqltableschema)
- Column overrides?

# 6/2
- Order by generation
- Projections -- count & ids
- Integrate https://github.com/marketplace/actions/todo-to-issue' ?
- Isolate integration test case databases....
  - I.e., create a new / clean DB for each test case.

# 6/1
- See `index.js` for `todo-mvc` about bootstrapping.
- Conversion of ids to 64bit ints upon storage
- Removal of Knex from test code
- Integration of @databases
- Simplify configuration and context creation?
- "unable to find code for manual section _foo_"
  - Well this could happen whenever we introduce a new mutation that previously did not exist.
- Imports for mutator args
  - E.g., TodoList in example
- Access to existing model in update mutation builders
- Nullability to mutator params... when defined via shortcut
  - Field types need their type atoms!\
- Device ids in context?
- Insert and reads
  - Ensure things are properly **ordered** on read and write
    - by encoding field names into spec
- Empty mutations should generate empty args

# 5/26
- Tests for in-memory filters
- Reactivity
- union/concat/map/etc query methods
- Actually start a transaction for your commit mutations in `persistor`
- bi-directional references... when creating objects that point to one another?
- Auto-generate ID on create -- depending on id type...
- computed fields
- return changesets from mutations?
  - Or add changesets to mutations for persist? Mutations that use mutations

# 5/22
- Create from data, re-hydrate cache?
- ~~Promise subclass~~
- ~~Switch to nanoid #22~~
  - Maybe,,,
- 'merge' codegen option
- ~~Preserve manual sections~~
- ~~prettier ignore partially generated code~~
  - Will need to suggest that users ignore `generated` folders
- Test error paths, smooth error messages
- 1+N query problem solution


- Schema Type validation on referenced types
  - Imports
- Back to tailer architecture for persister?
  - Would bring consistency to persist and replication.
- Discord setup
- ~~hop queries e2e test~~
- ~~devex on returns from mutations~~
- Revisit log and tail infra for persistence
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

---

Mutations that use mutations... How will we handle this?


# Reactivity Thoughts
Should we even re-run queries on node modification?
Should not the application developer listen to the nodes directly rather than the queries for those nodes?
If this is true we should _only_ react to creates and deletes......
I think this actually might be the optimal route.
It is slightly confusing but way better for perf and forces the developer to make better choices.
Why do I think this latter statement is true?

The problem an app could run into is multiple notifications and re-renders...

E.g.,

slide well listens to slide query to add/remove slides.
but it'll also get a query update even on slide modification.

we don't really care about the latter...

maybe live queries should let the dev say "live(['create', 'update', 'delete'])" or some such.

We could optimize further and ignore updates of fields that were not part of the filter set...
Since updating those fields does not change the query result.

Well the dev should choose that too. Maybe they do want new values (in the case that child comps don't listen directly to models).