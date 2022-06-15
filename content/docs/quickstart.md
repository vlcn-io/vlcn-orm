---
layout: docs
title: Quickstart
subtitle: get up and running with Aphrodite
---

`Aphrodite` makes it easy to describe, model and interact with your data. After installing `Aphrodite`, everything begins with defining a schema. If you'd like to understand *why* this project exists before diving in, see [[docs/why:Why Aphrodite?]]

# Setup

Create a directory for the quickstart project and cd into it. This is where we'll put our source and install our dependencies.

```bash
mkdir quickstart
cd quickstart
```

# Installation

`Aphrodite` has two main components:
1. The runtime for the given target
2. The codegen framework

These are shipped as two separated packages as the codegen framework is only needed during development and is not deployed with your application.

Install them using [npm](https://www.npmjs.com/) as seen below --

```bash
npm install --save @aphro/runtime-ts
npm install --save-dev @aphro/codegen-cli
```

# Configuration

Given `Aphrodite` will be talking to a database, it needs some information about the database in order to be able to connect. This information is saved in the `Context` type.

create a `main.ts` file.

```bash
mkdir src
touch src/main.js
```

and add the following to it

```javascript
import { context, anonymous, basicResolver } from '@aphro/runtime-ts';

async function main() {
  const ctx = context(anonymous(), basicResolver(db));
}

await main();
```

So what's going on here?

- `Anonymous` declares that the logged in viewer is anonymous. In the future `Aphrodite` will allow you to express permission rules which take in the current viewer. Given this is not yet implemented (see [[blog/roadmap]]), you'll need to handle permissions elsewhere and pass an anonymous viewer to `Aphrodite`.
- `basicResolver` is a function that returns a connection to the database. Note that we're currently passing an undefined variable `db` here -- we'll get to setting that up in the next section.
- Both parameters are passed into the `context` function which returns a new `context` for use when interacting with `Aphrodite`.

# DB Connection

Ok. Now lets get the `db` variable defined.

Getting a connection to the db differs by environment. For `Node`, the simplest route is to use `@databases/sqlite`. For the browser, use `@aphro/absurd-sql-connector`.

Lets concern ourself with `Node` for now after which you'll understand all the concepts needed to do the same thing in the browser.

Install the connection provider. In this cases `@databases/sqlite`

```bash
npm install --save @databases/sqlite
```

Now import it and use it to create a connection to the DB.

```javascript
import { context, anonymous, basicResolver } from '@aphro/runtime-ts';
import connect from "@databases/sqlite";

async function main() {
  const db = connect(DB_FILE_NAME);
  const ctx = context(anonymous(), basicResolver(db));
}
```

Replace `DB_FILE_NAME` with the path to your database. If the file does not exist it will be created. If you do not pass a file name your data will be stored in memory.

# Your First Schema

Schemas are the foundation of `Aphrodite`. They are stored as code and describe your application's data model. From the information provided in the schema, we go on to generate:

1. The corresponding database schema
2. Classes to represent your data in the target language
3. Query builders to traverse your data
4. Mutators to safely modify your data

To get started, create a file in your project's `src` directory called `domain.aphro`. This is where we'll place our node and edge definitions.

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

> Pro-tip: you can add this command to the `package.json` scripts entry so you don't have to remember it.

This will generate a few files:

```bash
src/generated
|-- TodoList.sqlite.sql
|-- TodoList.ts
|-- TodoListQuery.ts
|-- TodoListSpec.ts
```

# Adding a Mutation

We have classes that allow us to load and query `TodoList`. What's missing, however, is the ability to create a `TodoList`. This is because we haven't defined any mutations yet. Declaring mutations in the schema is a powerful feature -- it lets us auto-generate things like GraphQL mutations, declare permissions for mutations, turn our data access layer into a protocol.

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

You'll now see two new files -- `TodoListMutations.ts` and `TodoListMutationsImpl.ts`. We'll use these to create some data.

- `TodoListMutations.ts` is completely genenreated and exposes the mutation API.
- `TodoListMutationsImpl.ts` is where you enter your implementation of the API.

# Creating/Mutating a Node

Opening up `TodoListMutationsImpl.ts` you'll see this method that has been generated for you:

```typescript
export function createImpl(
  mutator: Omit<IMutationBuilder<TodoList, Data>, "toChangeset">,
  { name }: CreateArgs
): void | Changeset<any>[] {
  // Use the provided mutator to make your desired changes.
  // e.g., mutator.set({name: "Foo" });
  // You do not need to return anything from this method. The mutator will track your changes.
  // If you do return changesets, those changesets will be applied in addition to the changes made to the mutator.
}
```

Here you can fill in any logic that should take place upon creation. `TodoList` is pretty simple -- we'll only be setting the name on create. Inside the `create` method we can access the raw `mutator` which lets us change any property on the model.

```typescript
import { sid } from "@aphro/runtime-ts"; // new import to generate ids

export function createImpl(
  mutator: Omit<IMutationBuilder<TodoList, Data>, 'toChangeset'>,
  { name }: CreateArgs,
): void | Changeset<any>[] {
  mutator.set({
    id: sid("aaaa"), // we'll get into id generation later but just use this for now.
    name
  });
}
```

Now that the create mutation has been implemented, lets go ahead and use it.

In your `src/main.ts` add:

```typescript
import { context, anonymous, basicResolver } from "@aphro/runtime-ts";
import connect from "@databases/sqlite";
import TodoListMutations from "./generated/TodoListMutations.js"; // new import

async function main() {
  const db = connect(DB_FILE);
  const ctx = context(anonymous(), basicResolver(db));

  // new mutation call
  const [persistHandle, todoList] = TodoListMutations.create(ctx, {
    name: "My first list!",
  }).save();
}
```

Save returns two things:
1. A promise to the pending database write
2. An optimistic update, representing the created model

The optimsitc update is useful for highly interactive environments where you want to do something with the changes before the write actually completes.

Now if you were to run this you'll get an error because we haven't actually created the tables in the database yet!

# Bootstrapping / Table Creation

Lets go ahead and set up our database tables so we have something to read and write to. If you remember, the codegen step created a `sqlite.sql` file.

You have a few options here:
1. Manually run that against your `sqlite` db
2. Run it within your `main.ts` file

We'll assume you're going to do (2).

Create a `createTables` function in `main.ts`

```typescript
import { fileURLToPath } from 'url';
import { DatabaseConnection } from "@databases/sqlite";
import path from "path";
import { readdirSync } from "fs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createTables(db: DatabaseConnection) {
  const generatedDir = path.join(__dirname, "..", "src", "generated");
  const schemaPaths = readdirSync(generatedDir).filter(name => name.endsWith('.sqlite.sql'));

  const schemas = schemaPaths.map(s => sql.file(path.join(generatedDir, s)));

  await Promise.all(schemas.map(s => db.query(s)));
}
```

(TODO: create tables bootstrapping needs to be simplified)

and then call it from your `main` function --

```typescript
async function main() {
  const db = connect(DB_FILE);
  await createTables(db); // new call to `createTables`
  const ctx = context(anonymous(), basicResolver(db));

  const [persistHandle, todoList] = TodoListMutations.create(ctx, {
    name: "My first list!",
  }).save();
}
```

Great! We should be good to go to compile and run our script.

# Compile & Run

Compiling and running requires setting up the typescript compiler. Lets go ahead and do that

first, install typescript as a dependency

```bash
npm install --save-dev typescript
```

next, add a `tsconfig.json` to your project

```json
{
  "compilerOptions": {
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "module": "esnext",
    "target": "esnext",
    "moduleResolution": "Node",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false
  },
  "include": ["./src/"]
}
```

third, add `build` and `watch` scripts to your `package.json`

```json
...
"scripts": {
  "build": "tsc",
  "watch": "tsc -w"
}
...
```

finally we can run our build. Run it in watch mode so any time a ts file changes there will be a rebuild.

```bash
npm run watch
```

And now lets run our program:

```bash
node dist/main.js
```

Obviously this didn't do much that is useful for us. It create a list and exited. Lets move on to querying for nodes so we can see what has been written.

# Querying for Nodes

# Defining an Edge

# Walking a Graph

# Reactive Queries

# React Integration

-- vue, solid, svelt
