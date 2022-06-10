# Aphrodite - TodoMVC

**[Launch the example](https://aphrodite-examples.pages.dev/todo-mvc/)!**

*An implementation of [TodoMVC](https://todomvc.com/) using `Aphrodite` to manage the data model.*

# Code Overview

## Schema

The schema that defines the data model is [here](https://github.com/tantaman/aphrodite/blob/main/examples/todo-mvc/src/domain.aphro) (reproduced below)

```typescript
engine: sqlite
db: todomvc

Todo as Node {
  id: ID<Todo>
  listId: ID<TodoList>
  text: NaturalLanguage
  created: Timestamp
  modified: Timestamp
  completed: Timestamp | null
} & Mutations {
  create as Create {
    text
    listId
  }

  toggleComplete as Update {
    completed: Timestamp | null
  }

  setComplete as Update {
    completed: Timestamp | null
  }

  changeText as Update {
    text
  }

  delete as Delete {}
}

TodoList as Node {
  id: ID<TodoList>
  filter: Enumeration<all | active | completed>
  editing: ID<Todo> | null
} & OutboundEdges {
  todos: Edge<Todo.listId>
} & Mutations {
  create as Create {}

  filter as Update {
    filter
  }

  edit as Update {
    editing
  }
}
```

## Live Queries

The UI is updated via live queries. Whenever a modification is made to a model through a mutator, that update is reflected back into the UI.

Live queries are [here](https://github.com/tantaman/aphrodite/blob/main/examples/todo-mvc/src/App.tsx#L181-L186).

```typescript
const [activeTodos, completeTodos, allTodos] = unwraps(
  useQuery(UpdateType.ANY, () => list.queryTodos().whereCompleted(P.equals(null)), []),
  useQuery(UpdateType.ANY, () => list.queryTodos().whereCompleted(P.notEqual(null)), []),
  useQuery(UpdateType.CREATE_OR_DELETE, () => list.queryTodos(), []),
);
```

## Mutators

Changes to the data model are expressed using changesets. I.e., you collect all the changes you'd like to make and the commit them in one shot -- ensuring minimal notifications of changes and that your state is always consistent.

Some example [here](https://github.com/tantaman/aphrodite/blob/main/examples/todo-mvc/src/App.tsx#L151-L178)

```typescript
const clearCompleted = () =>
  commit(
    list.ctx,
    completeTodos.map(t => TodoMutations.delete(t, {}).toChangeset()),
  );
const startEditing = (todo: Todo) => TodoListMutations.edit(list, { editing: todo.id }).save();
const saveTodo = (todo: Todo, text: string) => {
  commit(
    list.ctx,
    TodoMutations.changeText(todo, { text: text }).toChangeset(),
    TodoListMutations.edit(list, { editing: null }).toChangeset(),
  );
};
const toggleAll = () => {
  if (remaining === 0) {
    // uncomplete all
    commit(
      list.ctx,
      completeTodos.map(t => TodoMutations.setComplete(t, { completed: null }).toChangeset()),
    );
  } else {
    // complete all
    commit(
      list.ctx,
      activeTodos.map(t => TodoMutations.setComplete(t, { completed: Date.now() }).toChangeset()),
    );
  }
};
```
