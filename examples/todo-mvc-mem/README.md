# TodoMVC - Mem

`Aphro` can use `SQL` as a backing store or it can work with the models in memory only.

The use case for the latter is a small set of application state that you'd like to work with completely in memory. You can persist the entire contents of the in-memory DB as a blob in LocalStorage or IndexDB to enable persistence across sessions.