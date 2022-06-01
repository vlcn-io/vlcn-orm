import Todo from './generated/Todo.js';
import React, { useState } from 'react';

type Filter = 'active' | 'none' | 'completed';

function Header() {
  return (
    <header className="header">
      <h1>todos</h1>
      <input type="text" className="new-todo" placeholder="What needs to be done?" autoFocus />
    </header>
  );
}

function TodoView({
  todo,
  editing,
  startEditing,
}: {
  key?: any;
  todo: Todo;
  editing: boolean;
  startEditing: (t: Todo) => void;
}) {
  let body;
  const saveTodo = () => {};
  const deleteTodo = () => {};
  const toggleTodo = () => {};

  if (editing) {
    body = <input type="text" className="edit" autofocus value={todo.text} onChange={saveTodo} />;
  } else {
    body = (
      <div class="view">
        <input
          type="checkbox"
          className="toggle"
          checled={todo.completed != null}
          onclick={toggleTodo}
        />
        <label ondblclick={() => startEditing(todo)}>{todo.text}</label>
        <button class="destroy" onClick={deleteTodo} />
      </div>
    );
  }
  return (
    <li className={(todo.completed != null ? 'completed ' : '') + (editing ? 'editing' : '')}>
      {body}
    </li>
  );
}

function Footer({
  remaining,
  todos,
  filter,
  clearCompleted,
  updateFilter,
}: {
  remaining: Todo[];
  todos: Todo[];
  filter: Filter;
  clearCompleted: () => void;
  updateFilter: (f: Filter) => void;
}) {
  let clearCompletedButton;
  if (remaining.length !== todos.length) {
    clearCompletedButton = (
      <button className="clear-completed" onClick={clearCompleted}>
        Clear completed
      </button>
    );
  }

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong> {remaining.length ? remaining.length : '0'} </strong>
        {remaining.length === 1 ? 'item' : 'items'} left
      </span>
      <ul className="filters">
        <li>
          <a className={filter === 'none' ? 'selected' : ''} onClick={() => updateFilter('none')}>
            {' '}
            All{' '}
          </a>
        </li>
        <li>
          <a
            className={filter === 'active' ? 'selected' : ''}
            onClick={() => updateFilter('active')}
          >
            Active
          </a>
        </li>
        <li>
          <a
            className={filter === 'completed' ? 'selected' : ''}
            onClick={() => updateFilter('completed')}
          >
            Completed
          </a>
        </li>
      </ul>
      {clearCompletedButton}
    </footer>
  );
}

export default function App() {
  const [filter, setFilter] = useState<Filter>();
  const state: { items: Todo[] } = {
    items: [],
  };
  const clearCompleted = () => {};
  const startEditing = () => {};
  const remaining = [];
  let toggleAll;

  if (state.items.length) {
    toggleAll = (
      <>
        <input
          type="checkbox"
          className="toggle-all"
          checked={remaining.length > 0}
          onclick="toggleAll();"
        />
        <label for="toggle-all">Mark all as complete</label>
      </>
    );
  }

  return (
    <div className="todoapp">
      <Header />
      <section className="main" style={state.items.length ? {} : { display: 'none' }}>
        {toggleAll}
        <ul className="todo-list">
          {state.items.map(t => (
            <TodoView key={t.id} todo={t} editing={false} startEditing={startEditing} />
          ))}
        </ul>
        <Footer
          remaining={remaining}
          todos={state.items}
          filter={filter}
          clearCompleted={clearCompleted}
          updateFilter={f => setFilter(f)}
        />
      </section>
    </div>
  );
}
