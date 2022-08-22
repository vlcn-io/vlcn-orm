# AbsurdSQL

Adapter to let `Aphrodite` query `AbsurdSQL`

We need custom support given `AbsurdSQL` is run in a web-worker and the application issuing queries is in the main browser thread. I.e., the connection from application to db is via `postMessage` in the browser.

Prior art:
- https://raw.githubusercontent.com/gammaql/greldal/20f65226256ec217ea056bf7e0c1eca48b5bb721/src/docs/utils/SQLJSClient.js
- https://github.com/ngokevin/expo-sqlite-plus-web/blob/main/src/db.web.ts#L22