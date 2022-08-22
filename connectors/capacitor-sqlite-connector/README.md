Uses https://github.com/storesafe/cordova-sqlite-storage (which works with Capacitor/Ionic) rather than https://github.com/capacitor-community/sqlite.

Why not use https://github.com/capacitor-community/sqlite?

The API really is not very clean (no connection objects, weird `changes` return values, no `bind` for params), looking through issues, the project may have a few unresolved memory leaks and the documentation is hard to follow.