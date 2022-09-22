# context-provider

Allows storing data in the current execution context and tracks across async calls.

Basically just pulled and isolated from `Dexie.js`

```
newScope(async () => {
  PSD.prop1...

  await foo();

  PSD.prop1...
}, {prop1: 'value', ...});
```
