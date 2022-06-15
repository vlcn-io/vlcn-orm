---
layout: docs
title: Queries
---

`Queries` are how we load our data from the database and into our application / into our [[docs/models:models]].

`Aphrodite` generates one query builder per `Node` in your [[docs/schemas:schema]]. These query builders can be used to load data, traverse edges between data, join, union, etc.

Lets take a look at a `Todo` schema and its generated `Query`.

**Todo node:**
```typescript
Todo as Node {
  id: ID<Todo>
  text: string
  completed: bool
}
```

**Generated Todo Query:**
```typescript
export default class TodoQuery extends DerivedQuery<Todo> {
  static create(ctx: Context);
  static fromId(ctx: Context, id: SID_of<Todo>);

  whereId(p: Predicate<Data["id"]>);
  whereText(p: Predicate<Data["text"]>);
  whereCompleted(p: Predicate<Data["completed"]>);
}
```

Taking a look at the query builder, we have one `where` method per field that exists on the model. We can use these to filter the data being loaded. E.g.,

```typescript
Todo.queryAll(ctx).whereText(P.equals(someText)).whereComplete(P.equals(false));
```

# Edge Traversals

We've only seen loading and filtering data of a single type. Lets take a look at traversing edges between types.

To traverse edges between types, we'll need to add an edge on our schema. We'll extend the `Todo` schema to include a `Person` schema and an edge from the `Person` to their `Todods`.

```typescript
Person as Node {
  id: ID<Person>
  name: string
} & OutboundEdges {
  todos: Edge<Todo.ownerId>
}

Todo as Node {
  id: ID<Todo>
  text: string
  completed: bool
  ownerId: ID<Person>
}
```

After running codegen, this'll create query builder for person that has a `queryTodos` method.

```typescript
class PersonQuery {
  queryTodos(): TodoQuery;
}
```

The `queryTodos` method allows us to pivot from `Person` to their `Todos`.

Example -- getting all todos for all people:
```typescript
Person.queryAll(ctx).queryTodos().whereComplete(P.equals(false));
```
