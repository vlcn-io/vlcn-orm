---
layout: docs
title: Permissions
---

> Permissions are not yet built out. See the [[blog/roadmap]] for when these will be released.

Under development here: https://github.com/tantaman/aphrodite/tree/main/extensions/authorization-grammar

# Auth Grammar

Extends the `Aphrodite SDL` with a grammar for defining row, column and edge level visibility.

**Before:**
```typescript
User as Node {
  id: ID<User>
  name: NaturalLanguage
  password: PBKDF2
}
```

**After:**
```typescript
User as Node {
  id: ID<User>
  name: NaturalLanguage
  password: PBKDF2 & Auth { read: [AllowIf((viewer, node) => node.id === viewer.id)] } # field level privacy
} & Authorization { # object level privacy
  read: [
    AlwaysAllow # everyone can see everyone
  ]
  write: [
    AllowIf((viewer, node) => node.id === viewer.id) # only user themselves can update themselves
  ]
}
```

> TODO: this should also extend the `mutation` grammar to allow auth on specific mutations.

## Prior Art / Inspired By
- https://entgo.io/docs/privacy
- https://www.osohq.com/
- https://www.postgresql.org/docs/current/ddl-rowsecurity.html