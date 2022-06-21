## Load the Database
Fetches the [Chinook](https://github.com/lerocha/chinook-database) dataset and populates an in-memory sqlite instance with it.

```typescript
import { Connection } from "@aphro/sqljs-connector";
import initSqlJs from "@aphro/sql.js";

const sqlPromise = initSqlJs({
  locateFile: (_file) => {
    return "https://esm.sh/@aphro/sql.js/dist/sql-wasm.wasm";
  },
});
const dataPromise = fetch(
  "https://unpkg.com/@aphro/chinook@0.1.1/db/chinook.sqlite"
).then((res) => res.arrayBuffer());

const [SQL, buf] = await Promise.all([sqlPromise, dataPromise]);
export const connection = new Connection(new SQL.Database(new Uint8Array(buf)));
```

## Configure Aphrodite

Now that we've loaded the database and established a connection,
tell `Aphrodite` about that connection.

```typescript
import { context, anonymous } from "@aphro/runtime-ts";
import { basicResolver } from "@aphro/runtime-ts";

export const ctx = context(anonymous, basicResolver($.connection));
```

## Load the TypeScript Models

We've created `Aphrodite` schemas to model the `Chinook` dataset [here](https://github.com/tantaman/aphrodite/blob/main/examples/chinook/src/domain.aphro).
<br/>The APIs exposed to query the dataset can be browser [here](https://github.com/tantaman/aphrodite/tree/main/examples/chinook/src/generated)

Load the domain model so we can start exploring the data!

```typescript
export * as models from "@aphro/chinook";
```

## Explore!

```typescript
const artists = await $.models.Artists.queryAll($.ctx).gen();
export default artists;
// export default (
//   <ol>
//     {artists.map((a) => (
//       <li>{a.title}</li>
//     ))}
//   </ol>
// );
```