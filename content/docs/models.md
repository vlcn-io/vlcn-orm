---
layout: docs
title: Models
---

`Models` are classes that let you interact with your data once it is loaded. One model class is generated for each `Node` [[[docs/schema:schema]].

Lets take a look at a `Todo` schema and its generated `Model`.

**Todo node:**
```typescript
Todo as Node {
  id: ID<Todo>
  text: string
  completed: bool
}
```

**Generated Todo model:**
```typescript
export default class Todo extends Model<Data> {
  readonly spec = s as ModelSpec<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as SID_of<this>;
  }

  get text(): string {
    return this.data.text;
  }

  get completed(): bool {
    return this.data.completed;
  }

  static queryAll(ctx: Context): TodoQuery {
    return TodoQuery.create(ctx);
  }

  static async genx(ctx: Context, id: SID_of<Todo>): Promise<Todo> {
    const existing = ctx.cache.get(id);
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue();
  }

  static async gen(ctx: Context, id: SID_of<Todo>): Promise<Todo | null> {
    const existing = ctx.cache.get(id);
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genOnlyValue();
  }
}
```

Taking a look at the model, we have one getter per field that exists in the schema. We also have three static methods:

1. queryAll
2. genx
3. gen

`QueryAll` returns a [[docs/queries:query]] that we can use to fetch and filter all todos.

`genx` is a method that we can use to load a `Todo` by its primary key.

`gen` is the same as `genx` except that it will return null, instead of throwing, if the `Todo` being fetched does not exist.

Note that the model is read only. There is no way to make changes to it. To do that, you'll need to use a [[docs/mutations-and-transactions:mutator]].