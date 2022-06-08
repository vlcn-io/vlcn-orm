---
layout: docs
title: Quickstart
subtitle: get up and running with Aphrodite
---

`Aphrodite` makes it easy to describe, model and interact with your data. After installing `Aphrodite`, everything begins with defining a schema. If you'd like to understand *why* this project exists before diving in, see [[docs/why:Why Aphrodite?]]

> Note: `Aphrodite` currently targets TypeScript and the browser. To see when support will be added for vanilla `JS`, `Node`, `iOS`, and `Android` see the [[blog/roadmap:roadmap]].

# Installation

`Aphrodite` has two main components:
1. The runtime for the given target
2. The codegen framework

These are shipped as two separated packages as the codegen framework is only needed during development and is not deployed with your application.

Install them using [npm](https://www.npmjs.com/) as seen below --

```bash
npm install @aphro/runtime-ts
npm install --save-dev @aphro/codegen-cli
```

# Your First Schema

Schemas are the foundation of `Aphrodite`. They are stored as code and describe your application's data model. From the information provided in the  schema, we go on to generate:

1. The corresponding database schema
2. Classes to represent your data in the target language
3. Query builders to traverse your data
4. Mutators to safely modify your data

To get started, create a file in your project's `src` directory called `domain.aphro`. This is where we'll place are node and edge definitions.

Open that file and define a `TodoList` node --

```typescript
engine: sqlite
db: example

TodoList as Node {
  id: ID<TodoList>
  name: string
}
```

next run

```bash
npx aphro gen src/domain.aphro -d src/generated
```

This will generate a few files:

```bash
src/generated
|-- TodoList.ts
|-- TodoListQuery.ts
|-- TodoListSpec.ts
```

# Adding a Mutation

We have classes that allow us to load and query TodoList. What's missing, however, is the ability to create one. This is because we haven't defined any mutations that can act on TodoList.

Open `domain.aphro` and add the following:

```typescript
engine: sqlite
db: example

TodoList as Node {
  id: ID<TodoList>
  name: string
} & Mutations {
  create as Create {
    name
  }
}
```

then re-run the codegen

```bash
npx aphro gen src/domain.aphro -d src/generated
```

You'll now see a new file called `TodoListMutations.ts`. We'll use this to create some data.

# Creating/Mutating a Node

Opening up `TodoListMutations.ts` you'll see this manual section:

```typescript
create({ name }: { name: string }): this {
  // BEGIN-MANUAL-SECTION: [create]
  throw new Error("Mutation create is not implemented!");
  // END-MANUAL-SECTION
  return this;
}
```

Here you can fill in any logic that should take place upon creation. `TodoList` is pretty simple -- we'll only be setting the name on create. Inside the `create` method we can access the raw `mutator` which lets us change any property on the model.

```typescript
create({ name }: { name: string }): this {
  // BEGIN-MANUAL-SECTION: [create]
  this.mutator.set({
    name
  });
  // END-MANUAL-SECTION
  return this;
}
```

Now that the create mutation has been implemented, lets go ahead and use it. Create a `main.js` file in `src`.

```typescript
import TodoListMutations from './generated/TodoListMutations.js';

const [persistHandle, todoList] = TodoListMutations.create(ctx, {name: 'My first list!'}).save();
```

Save returns two things:
1. A promise to the pending database write
2. An optimistic update, representing the created model

The optimsitc update is useful for highly interactive environments where you want to do something with the changes before the write actually succeeds.

> TODO: go over context creation and/or provide default contexts.

# Querying for Nodes

# Defining an Edge

# Walking a Graph

# Reactive Queries

# React Integration

-- vue, solid, svelt

`Aphrodite` is under active development here: [https://github.com/tantaman/aphrodite](https://github.com/tantaman/aphrodite)

It **is not** ready for release.

A TodoMVC example app that uses Aphrodite is under development here: [https://github.com/tantaman/aphrodite/tree/main/examples/todo-mvc](https://github.com/tantaman/aphrodite/tree/main/examples/todo-mvc)


Integration tests to show the various described use cases are being built out here: [https://github.com/tantaman/aphrodite/blob/main/packages/integration-tests-ts/src/__tests__/](https://github.com/tantaman/aphrodite/blob/main/packages/integration-tests-ts/src/__tests__/) (and up a dir)

