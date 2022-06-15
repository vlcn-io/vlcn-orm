---
layout: docs
title: Schemas
---

`Schemas` are the core of `Aphrodite`. Schemas capture:

1. The nodes in your data model
2. Relationships (edges) between them
3. Permissions (who can read what nodes and what relationships)
4. Persistence (where is the node/edge stored)
5. Mutations (what about a node or edge can be changed, how and by who)
6. Constraints (uniquness, indices, etc.)

You can describe as much or as little as your data model as you like. The more you describe, the more `Aphrodite` can help you.

# Example Schemas

Schemas are written in a simple DSL. This DSL only lets you declare things and not write arbitrary computations. The principle behind this is that if something about your data cannot be described declartively, it does not belong in `Aphrodite`.

## Node Example (foo.aphro)

```typescript
engine: sqlite

Foo as Node {
  id: ID<Foo>
  name: string
  age: int32
  created: Timestamp
  height: float32
  something: Enumeration<A | B | C>
}
```

A few things to note here:
1. Nodes are defined as `$identifier as Node`
2. What follows is a list of fields that make up the node
3. Fields can be any of the data types listed in [[docs/data-types]]

Nodes can be _extended_ with more options via `&`. Lets see some extensions.

## Node Extensions

The definition of a node can be extended with:
- Edges
- Mutations
- GraphQL definitions
- Permissions
- Constraints & Indices
- 3rd party extensions

All extensions to a node follow a syntax that looks like:

```typescript
X as Node {
  ...
} & EXTENSION_1 { EXTENSION_1_ARGS } & EXTENISON_2 { EXTENSION_2_ARGS } & ...
```

Any number of extensions can be applied to a node. Extensions have access to and augment the definitions that come before them.

## Outbound Edges Example

```typescript
Foo as Node {
  ...
  bazId: ID<Baz>
} & OutboundEdges {
  bars: Edge<Bar.fooId>
  baz: Edge<Foo.bazId>
}
```

Edges can be _through_ a field. E.g., the edge from `foo` to `Baz` is through `Foo.bazId`.

## Mutations Example

```typescript
Foo as Node {
  id: ID<Foo>
  name: string
  age: int32
  created: Timestamp
  height: float32
} & Mutations {
  create as Create {
    name # args that match field names get their type from the field name
    age
    height
  }

  rename as Update {
    name
    customArg: string # can add custom args
    bar: Bar # can take other nodes as input
  }
}
```

## GraphQL Example

```typescript
Foo as Node {
  ...
} & GraphQL {
  read {
    # names of fields to expose for read operations
  }
  write {
    # names of mutations to expose for write operations
  }
  root # generate a root call to load `Foo`
}
```

## Junction Edge

Junction edges / pivot tables allow us to declare many-to-many relationships. Edges can have data if you like or have no fields.

```typescript
Followers as Edge<Person, Person> {}

Person as Node {
  id: ID<Person>
} & OutboundEdges {
  followers: Followers
}
```