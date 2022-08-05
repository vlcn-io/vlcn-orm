---
layout: docs
title: Reactivity
---

Often we need to respond to changes in our data model. This is especially the case when developing UIs, where any change in the data can cause updates all across the display.

`Aphrodite` lets you subscribe to your queries. Whenever any data is changed that would impact the result of a query, you'll be called back with the new dataset.

This vastly simplifies application development. `React` removed the burden of updating a display. `Aphrodite` reactivity removes the burden of managing and responding to your state.

# Example

Any query can be turned into a "live result" through the `live` method.

```typescript
const liveResult = viewer.queryTodos().whereComplete(P.equals(false)).live();
liveResult.subscribe((todos) => ...);

// or
for (await r of liveResult.generator) {
  // ...
}
```

A `useQuery` hook is currently provided for `React` developers in the `@aphro/react` package.

This hook can be used like so:

```typescript
const {loading, data, error} = useQuery(
  () => list.queryTodos().whereCompleted(P.equals(filter)),
  [filter],
);
```

For a full featured example of reactive queries see the [`Todo-MVC` example](https://github.com/tantaman/aphrodite/tree/main/examples/todo-mvc).