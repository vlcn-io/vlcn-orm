---
layout: docs
title: Migrations
---

Aphrodite provides automatic migration functionality. If you evolve your schema following a certain set of rules, you can always use automatic migrations and never have to write a manual migration.

# Automatic Migrations

Aphrodites incorporates some features of [Thrift](https://thrift.apache.org/) and [Google Protocol Buffers](https://developers.google.com/protocol-buffers) to enable automatic migrations. Both of those libraries are made for exchanging messages between services. Services which might have different versions of the message definitions, thus messages must be backwards and forwards compatible. One of the key ways they achieve this compatibility is by associating numbers with field definitions in the message.

The number, not the name, is what identifies the field for the protocol.

```protobuf
message Person {
  required string name = 1;
  required int32 id = 2;
  optional string email = 3;
}
```
*Fig 1: Example message definition from Google Protocol Buffers.*

Numbers allow the protocol to track fields through renames. A message version that calls a field "a" and another that calls the same numbered field "b" can still interoperate.

In Aphrodite you can (should) number the fields in your schema.

```typescript
Todo as Node {
  1 id: ID<Todo>
  2 listId: ID<TodoList>
  3 text: string
  4 completed: bool
}
```
*Fig 2: Example schema definition, with field numbering, in Aphrodite*

When doing a migration `Aphrodite` uses the field numbers to determine what fields were modified (e.g., renamed) vs which were added or removed.

## Rules for Safe Automatic Migrations

The rules are similar to those in Google Protocol Buffers ([here](https://developers.google.com/protocol-buffers/docs/proto3#updating)) but you have some extra freedoms in `Aphrodite`. The reason there is more freedom is that schema migrations only have to be forwards, not backwards, compatible. I.e., once an update is shipped to a device, there is no more old code left to read the new data.

**Rules:**

**Safe operations:**
1. Removing a column is always safe
2. Adding a nullable column is always safe
3. Adding a non-nullable column with a default value is always safe
4. Renaming a column (so long as the column is numbered with the same number in the old and new schema) is always safe
5. Changing the type of a column to a compatible type is safe
   1. Compatible types are any type where type-coercion in your language would do what you expect.


**Unsafe operations:**
1. Changing the type of an existing column to an incompatible type.
   1. Incompatible types are any type where the type coercion in the language being used would provided unexpected results. E.g., string -> int in JavaScript.
2. Adding a new non-nullable column without a default value
3. Changing the number of an existing field. There should never be a reason to do this.

## Using Automatic Migrations

```typescript
// use the bootstrap package
import { bootstrap } from "@aphro/runtime-ts";

// change the below line to import the generated `exports-sql.js` file
// this file imports the create table statements.
import sqlFiles from "./domain/generated/exports-sql.js";

// tell `bootstrap` to create tables and automigrate if those tables exist
await bootstrap.createAutomigrateIfExists(context.dbResolver, sqlFiles);
```

You can see an example in the [aphrodite-browser-starter](https://github.com/tantaman/aphrodite-browser-starter/blob/main/src/index.tsx#L21).

# Manual Migrations

`Aphrodite` does not yet have a framework in which to run manual migrations. You can, however, follow the following process to do a manual migration:

1. Diff the generated `.sql` files between your last release and your current release
   1. Only writing migrations between releases cuts down on how often you need to perform them. During development between releases, you can use auto migrations (even if they're unsafe) for improved dev speed.
2. Write your migration script
3. Run that script, in a transaction, when your app starts

You'll need a way to determine if the migration should run on the given device such as by storing the db version.

E.g.,

```typescript
await myMigration(ctx);

async function myMigration(ctx) {
  if (current_db_schema_version === X) {
    const connection = ctx.dbResolver.engine('sqlite').db('my-db');
    await connection.query(sql`BEGIN`);
    try {
      await connection.query(sql`ALTER TABLE ...`);
      await connection.query(sql`ALTER TABLE ...`);
      await connection.query(sql`ALTER TABLE ...`);
      ...
      await connection.query(sql`COMMIT`);
    } catch (e) {
      await connection.query(sql`ROLLBACK`);
    }
  }
}
```

Of course a device could be several versions or migrations behind. As such, you'll want to keep all migration scripts around so you can apply them successively to move a client from v0 -> v1 -> v2 -> latest.

Example of this idea from the `WebSQL` years: https://gist.github.com/YannickGagnon/5320593

