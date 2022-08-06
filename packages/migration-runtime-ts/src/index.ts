export * from './bootstrap.js';

// export function getTableSchemasFromStorage(db: SQLResolvedDB): Map<string, string> {
//   return new Map();
// }

// export function getDbVersion(db: SQLResolvedDB): string {
//   return '';
// }

// export function getSchemaDeltas(leftSql: string, rightSql: string) {}

/*
Should we instead persist the aphro schema version into the metadata table?
And operations would be against aphro schemas...
We'd have to ship the parser and sql codegen in order to enable this.

What does this workflow look like?
You'd snapshot your schema at a given version?

Should we start with a `yolo` mode that auto runs alter tables as it finds deltas?

A non-yolo mode would user versioning and any time there's a bump between versions the author
must provide a migration script.

We can generate a starter-script for them that has the alter table commands.

Bootstrapping should
0. open tx
1. Create tables
2. Create / update metadata table
3. Persist current aphrodite schema versions in metadata table

We need to ship with both a:
1. Aphrodite schema map 
2. SQL schema map

Or we can ship with just the former and gen the latter as needed...


*/

// Bootstrap function that takes in `domain.aphro` and a connection.
// Will thus need to depend on sql codegen package.
