`Aphrodite` is a schema layer whose first goal is to make [P2P](https://en.wikipedia.org/wiki/Peer-to-peer) & [Local-First](https://www.inkandswitch.com/local-first/) software as easy to develop as traditional client-server software.

You can think of `Aphrodite` as an `ORM` of sorts that is designed for the needs of [Local-First](https://www.inkandswitch.com/local-first/) applications and [P2P](https://en.wikipedia.org/wiki/Peer-to-peer) data transfer.

# Overview

The core of any application is its data and the consistency of that data. As such, everything in `Aphrodite` begins with a schema. This schema encodes the application's data, its relationships, consistency rules, allowed mutations and privacy.

## Schema

`Aphrodite` Schemas are written in a `DSL`. This `DSL` describes the `nodes` and `edges` that make up the application's data model. The schema can represent graph or relational data models.

**Example**
```js
User as Node {
  id: ID<User>
  name: NaturalLanguage
  created: Timestamp
  modified: Timestamp
} & OutboundEdges {
  todos: Edge<Todo.ownerId>
}

Todo as Node {
  id: ID<Todo>
  text: NaturalLanguage
  completed: Timestamp | null
  created: Timestamp
  modified: Timestamp
  ownerId: ID<User>
} & OutboundEdges {
  owner: Edge<ownerId>
}
```

From the schema definition, `Aphrodite` generates `TypeScript` (and eventually other target languages) classes to interact with your data.

## Queries

Queries allow you to load, find and join your data in arbitrary ways.

To support local first development, all queries against your data can be made reactive. Also to support local first, all components that view a given piece of data will always see the latest version of that data unless they explicitly and overtly decide not to.

**Load and Query**
```typescript
const user = await User.load(`user-id`);
const todos = await user.queryTodos().gen();

const liveCompletedTodos = user.queryTodos().whereCompleted(P.notEqual(null)).live();

liveCompletedTodos.subscribe((completed) => ...);

function TodoList({user}: {user: User}) {
  const todos = useQuery(() => user.queryTodos().live());
  return todos.map(todo => <Todo todo={todo} />);
}
```

## Mutations

Before you can query any data you need to create it. `Aphrodite` supports mutation primitives to allow you to do this in a safe and declarative way.

To ensure your app never sees transient state, `Aphrodite` has concepts of `mutators`, `changesets` and `transactions`. These allow you to describe a change in full and then commit those changes all at once. Valid mutations can be declared on the schema to allow programmatic discovery of operations against your data (inspired by [Block Protocl](https://blockprotocol.org/) and A Protocol for Integrations ([draft post](https://github.com/tantaman/tantaman.github.io/blob/master/_drafts/2022-01-26-protocol-for-integrations.markdown)).

**Declare Mutations**
```js
Todo as Node {
  ...
} & OutboundEdges {
  ...
} & Mutations {
  create {
    text
  }
  complete
  uncomplete
}
```

**Transactions**
```js
const mutation = TodoMutations.create(viewer, 'My first todo which is already done!').complete();

// We can either commit the mutation now
await mutation.save();

// Or we can batch it with other mutations that should be commited all at once
await commit(mutation.toChangeset(), TodoMutation.create(viewer, 'My second todo!').toChangeset());
```

You can collect as many mutations to your application's state as you want before finally committing them all together. Rather than opening a transaction at one line of code and committing it at another, you collect changesets. Once you have all the changes you want you commit them together.

## P2P

To support syncing, you can opt your data models into `P2P` replication and declare what [conflict free replicated data type](https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type) (CRDTs) to use under the hood to merge state across peers.

**Example Replication Declarations**
```js
Todo as Node {
  ...
} & Replication {
  ColumnLevel {
    lastWriteWins
  }
  Clock {
    Logical
  }
}

-or-

Todo as Node {
  ...
} & Replication {
  InstanceLevel {
    lastWriteWins
  }
  Clock {
    HybridLogical {
      resolution: 60s
    }
  }
}
```

**Note** -- P2P syncing via CRDTs does not support transactions fully. You can create and commit a transaction on one client but, due to the nature of CRDTs, other clients may not accept the full contents of the transaction. So how do we ensure data consistency in the face of this?

## Data Consistency

Developers can define integrity constraints on their schemas. When a replicated update is received that violates the constraint, a new state update is added that rolls back the update. This feature is still in the research phase to understand what constraints and rollbacks can be supported in a p2p environment without causing state loops amongst peers.

The data consistency ideas are part inspired by [Conflict Free Replicated Relations](https://hal.inria.fr/hal-02983557/document) and the internal `Ent Integrity` project at [Meta](https://engineering.fb.com/).

## Schema Replication

In a distributed system, every peer could be running a different version of your software. This makes schemas all the more important. By having you data schematized, we can understand which clients and which pieces of data are ahead or behind in terms of data format.

A peer whose data format is behind another peer's would cause problems if they tried to replicate changes to one another. One peer may have consistency rules that another does not. One peer may have fields removed from their schema that another has added. To combat this, `Aphrodite` pushes schema replications to auto-upgrade all peers to the greatest common version of a schema before replicating data controlled by that schema.

Schema version changes brings us to the next topic -- data migrations.

## Migrations

Migrations between schema versions are encoded into `Aphrodite` schemas.

```js
Todo as Node {
  id: ID_of<Todo>
  text: NaturalLanguage
  completed: boolean
} & Migrations {
  v1: {
    completedTime {
      priorField: completed
      newField: Timestamp | null
      convert: (oldValue) => oldValue ? Date.now() : null
    }
  }
}
```

All migration definitions are retained so any peer that joins a network can have their schema moved through the successive versions until it is up to date.

There are issues for very large datasets to consider as migrating billions of rows is not instant. We have a few plans to address this:
1. For traditional server type deployments, allow mechanisms such as taking a db replica offline to run migrations then bringing it back online, catching it up then swapping it to master
2. Allow migrations to be run lazily. I.e., apply the migration functions as needed as data is loaded by the application. This will only work for a subset of migration types.

## Privacy

You may have noticed references to `owner` and `viewer` in the example code. This is because `Aphrodite` supports privacy on data even though it targets local first development.

Imagine you have a local first app but your users want to be able to share parts of their local data with others. Your user's data shouldn't be replicated to just anyone. There need to be privacy controls in place to determine what users receive what updates.

`Aphrodite` allows you to declare these rules on the schema itself or, when they're more complicated, within `TypeScript`.

The rules are run any time data is loaded and any time is it being replicated across the network to a peer. Mutation rules can also be enable to allow read access but not write or vice-versa.

```js
Todo as Node {
  id: ID<Todo>
  text: NaturalLanguage
  completed: Timestamp | null
  ownerId: ID<User>
} & Edges {
  sharedWith: JunctionEdge<Todo, User>
} & ReadPrivacy {
  AllowIf((viewer, todo) => todo.ownerId === viewer.id),
  AllowIf((viewer, todo) => todo.querySharedWith().whereId(P.equals(viewer.id)).exists())
  AlwaysDeny
}
```

Write rules can be added to allow peers to reject incoming changes to data they don't want updated.

## Polyglot Storage & Server Side

`Aphrodite` isn't constrainted to local first software. It can act as a fully featured `ORM` for backends as well and allows traditional client-server development in addition to p2p applications.

`Aphrodite` will also support joins across different storage layers. E.g., traversing edges between `SQL`, `Redis`, `Neo4j` rows. This is done via [ChunkIterables](https://gist.github.com/tantaman/bd928ef93619e73365b07899da282996#aside---traversing-across-storage-backends) and [HopPlans](https://github.com/tantaman/aphrodite/blob/main/packages/query-runtime-ts/src/HopPlan.ts).

# Current Implementation

`Aphrodite` is under active development here: [https://github.com/tantaman/aphrodite](https://github.com/tantaman/aphrodite)

A TodoMVC example app that uses Aphrodite is under development here: [https://github.com/tantaman/aphrodite/tree/main/examples/todo-mvc](https://github.com/tantaman/aphrodite/tree/main/examples/todo-mvc)

It **is not** ready for release.

Integration tests to show the various described use cases are being built out here: [https://github.com/tantaman/aphrodite/blob/main/packages/integration-tests-ts/src/__tests__/](https://github.com/tantaman/aphrodite/blob/main/packages/integration-tests-ts/src/__tests__/) (and up a dir)