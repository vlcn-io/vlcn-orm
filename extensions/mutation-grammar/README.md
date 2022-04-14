# Mutation Grammar

Extends `Aphrodite SDL` with a grammar for defining mutations.

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
  password: PBKDF2
} & Mutations {
  create {
    name
    password
  }

  delete {}

  rename {
    name
  }
}
```

This can be used in conjunction with the Auth extension to enable declaring auth policies on mutations.