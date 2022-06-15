---
layout: docs
title: Mutating Data
---

Before you can query any data you need to create it. `Aphrodite` supports mutation primitives to allow you to do this in a safe and declarative way.

To ensure your app never sees transient state, `Aphrodite` has concepts of `mutators`, `changesets` and `transactions`. These allow you to describe a change in full and then commit those changes all at once. Valid mutations can be declared on the schema to allow programmatic discovery of operations against your data (inspired by [Block Protocol](https://blockprotocol.org/) and A Protocol for Integrations ([draft post](https://github.com/tantaman/tantaman.github.io/blob/master/_drafts/2022-01-26-protocol-for-integrations.markdown)).

**Declare Mutations**
```js
Todo as Node {
  id: ID<Todo>
  text: string
  completed: bool
} & OutboundEdges {
  ...
} & Mutations {
  create as Create {
    text
  }
  edite as Update {
    text
  }
  complete as Update {}
  uncomplete as Update {}
  delete as Delete {}
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

You can collect as many mutations to your application's state as you want before finally committing them all together. Rather than opening a transaction at one line of code and committing it at another, you collect changesets.