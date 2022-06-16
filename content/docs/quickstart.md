---
layout: docs
title: Quickstart
subtitle: get up and running with Aphrodite
---
<div class="pre-release-note">
  <p>
    NOTE: Aphrodite is <span>pre-release</span>. See the <a href="blog/roadmap">roadmap</a>.
  </p>
</div>

`Aphrodite` makes it easy to describe, model and interact with your data. If you'd like to understand *why* this project exists before diving in, see [[docs/why:Why Aphrodite?]]

# Starter Repositories

If you learn faster by looking at code, we have a **starter repositories** you can clone and get running with. The starter projects also take care of most of the boilerplate in this guide.

- Local-First Browser Starter (WIP but see the [TodoMVC example](https://github.com/tantaman/aphrodite/blob/main/examples/todo-mvc/))
- Node JS Starter [GitHub](https://github.com/tantaman/aphrodite-node-starter) | [GitPod](https://gitpod.io/#git@github.com:tantaman/aphrodite-node-starter.git)
- GraphQL Server Starter (WIP) [GitHub](https://github.com/tantaman/aphrodite-graphql-starter) | [GitPod](https://gitpod.io/#git@github.com:tantaman/aphrodite-graphql-starter.git)
- Deno Starter (WIP)
- iOS Starter (WIP)
- Android Starter (WIP)

> Why server components if you're local-first? For improved durability and availability for those that want it.

# Setup

We'll assume you did not clone any of the starter projects above. If you did, you can use those and skip the steps that are already completed.

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
  const db = connect("test.db");
  const ctx = context(anonymous(), basicResolver(db));
}
```

"test.db" will be the file that holes our database. If the file does not exist it will be created. If you do not pass a file name your data will be stored in memory.

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

# Bootstrapping / Table Creation

All the schemas are generated but we haven't actually set up our database or created the tables! Lets go ahead and do that.
The codegen step created a `TodoList.sqlite.sql` file that we can use to create the TodoList table.

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
  const db = connect("test.db");
  await createTables(db); // new call to `createTables`
  const ctx = context(anonymous(), basicResolver(db));
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
    "allowSyntheticDefaultImports": true,
    "module": "esnext",
    "target": "esnext",
    "moduleResolution": "Node",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./"
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

finally, we can run our build. Run it in watch mode so any time a ts file changes there will be a rebuild.

```bash
npm run watch
```

And now, in another terminal, lets run our program:

```bash
node dist/main.js
```

You should see that "test.db" was created in your project root. If you want to inspect this file you can use [SQLite Browser](https://sqlitebrowser.org/) or install [vscode-sqlite](https://marketplace.visualstudio.com/items?itemName=alexcvzz.vscode-sqlite).


# Querying for Nodes

If you take a look at the generated `TodoList` model (`TodoList.ts`) you'll see that it provides a number of methods for fetching and querying `TodoLists`.

```typescript
static queryAll(ctx: Context): TodoListQuery;

static async genx(
  ctx: Context,
  id: SID_of<TodoList>
): Promise<TodoList>;

static async gen(
  ctx: Context,
  id: SID_of<TodoList>
): Promise<TodoList | null>;
```

We'll use these to query for `TodoLists`. Lets update our main function.

```typescript
import TodoList from "./generated/TodoList.js";

async function main() {
  const db = connect(DB_FILE);
  await createTables(db); // new call to `createTables`
  const ctx = context(anonymous(), basicResolver(db));

  // Query our todo lists -- none exist yet so we should get back an empty list
  const lists = await TodoList.queryAll(ctx).gen();
  console.log(lists);
}
```

We haven'te created any todolists yet so the output of our program is just `[]`. Lets move on to creating some data.

# Adding a Mutation

We have classes that allow us to load and query `TodoList`. What's missing, however, is the ability to create a `TodoList`. This is because we haven't defined any mutations yet. Mutation are defined on our schemas. Declaring mutations in the schema is a powerful feature -- it lets us auto-generate things like `GraphQL` mutations, declare permissions for mutations, and turn our data access layer into a protocol (for cool things like integration into [block protocol](https://blockprotocol.org/)).

Open `domain.aphro` and add the following:

```typescript
engine: sqlite

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

# Creating / Mutating a Node

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

Here you can fill in any logic that should take place upon creation. `TodoList` is pretty simple -- we'll only be setting the name and id on create. Inside the `create` method we can access the raw `mutator` which lets us change any property on the model.

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

Update `src/main.ts` --

```typescript
import TodoListMutations from "./generated/TodoListMutations.js"; // new import

async function main() {
  const db = connect("test.db");
  await createTables(db);
  const ctx = context(anonymous(), basicResolver(db));

  // Check for existing lists
  let lists = await TodoList.queryAll(ctx).gen();
  // If there are none, create one
  if (lists.length === 0) {
    let writeHandle;
    [writeHandle, todoList] = TodoListMutations.create(ctx, {
      name: "My first list!",
    }).save();

    // Wait for our write to persist
    await writeHandle;
    lists = await TodoList.queryAll(ctx).gen();
  }

  console.log(lists);
}
```

Save returns two things:
1. A promise to the pending database write
2. An optimistic update, representing the created model before the DB write has completed

The optimsitc update is useful for highly interactive environments where you want to do something with the changes before the write actually completes.

The above code is a little cumbersome if we only want to create a single list. Lets clean it up.

```typescript
async function main() {
  const db = connect("test.db");
  await createTables(db);
  const ctx = context(anonymous(), basicResolver(db));

  let todoList = await TodoList.queryAll(ctx).genOnlyValue(); // `genOnlyValue` instead of `gen`
  if (todoList == null) {
    let _;
    [_, todoList] = TodoListMutations.create(ctx, {
      name: "My first list!",
    }).save();
  }

  console.log(todoList);
}
```

Great, we've made a list but we don't have any todos.

# Defining an Edge

# Walking a Graph

# Reactive Queries

# React Integration

-- vue, solid, svelt
