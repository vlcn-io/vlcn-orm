# AbsurdSQL

Adapter to let `Aphrodite` query `wa-sqlite`

We need custom support given `wa-sqlite` is run in a web-worker and the application issuing queries is in the main browser thread. I.e., the connection from application to db is via `postMessage` in the browser.

TODO: can we merge common code with Absurd-SQL connector?