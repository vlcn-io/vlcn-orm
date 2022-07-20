# Migration Runtime

Your DB is on the client's device and you pushed an udpated to your app that changes the DB schema! OMG! What DO!?

The migration library provides a set of tools to enable you to manage and migrate database versions.

## Tools
- Interact with db metadata (e.g., version, pull schemas)
- Compare table schemas in app vs table schemas in db
- Drop tables
- Recreate tables
- Calculate alter statements
- Apply migrations

Some prior art from the days when websql was a thing:
- https://github.com/nanodeath/JS-Migrator/blob/master/migrator.js
- https://blog.maxaller.name/2010/03/html5-web-sql-database-intro-to-versioning-and-migrations/
- https://gist.github.com/YannickGagnon/5320593

# Ideas

## Yolo Mode

1. Drop mode
2. Auto-alter mode

Drop mode just drops and re-creates the tables any time a delta is detected.

Auto-alter diffs the (1) running schema with the (2) persisted schema. Deltas are converted to alter table statements and run.

## Versioned mode

Versioned mode works by having a version in the schema file.

Any time the version jumps the next codegen run will generate a migration script placeholder. This'll have generate alter statements within but also allow the author to insert their own logic. E.g., to map old columns to new.

## Logging

We need to get data back about failed migrations from our clients. Is this opt-in? Do we create a package that can be included to gather error data and ship it back home?

## CRDTs

We need to consider how we'll handle tables that are replicated p2p in the face of migrations.
1. We could stop clients from participating in the network until they've upgraded to the version of the most up to date client...
2. We could run migration scripts (the data transform not alter table parts) in-memory to move an old version write to a new one. This of course needs to be reversable too and... if fields are combined what happens to their clocks?

Probably go with (1) for the MVP. (1) still has clock and versioning issues though... similar to what (2) had but we cut the bi-directional problem.

3. Counter
4. LWW registers
5. Sequence
6. clock push
7. Row level vs column level resolution

## Prior art

https://github.com/groue/GRDB.swift/blob/master/README.md (see their migrations syntax and handling -- pretty nice)