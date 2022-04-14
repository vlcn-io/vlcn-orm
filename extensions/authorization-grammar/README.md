# Auth Grammar

Extends `Aphrodite SDL` with a grammar for defining row, column and edge level visibility.

Before:
```
User as Node {
  id: ID<User>
  name: NaturalLanguage
  password: PBKDF2
}
```

After:
```
User as Node {
  id: ID<User>
  name: NaturalLanguage
  password: PBKDF2 & Auth { red: [AllowIf((viewer, node) => node.id === viewer.id)] } # field level privacy
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