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