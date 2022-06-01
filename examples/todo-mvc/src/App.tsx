import Todo from './generated/Todo.js';
import React, { useState, useEffect } from 'react';
import TodoList from './generated/TodoList.js';
import { Data } from './generated/TodoList.js';
import TodoListMutations from './generated/TodoListMutations.js';

type Filter = Data['filter'];

function Header({ todoList }: { todoList: TodoList }) {
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
  clearCompleted,
  todoList,
}: {
  remaining: Todo[];
  todos: Todo[];
  clearCompleted: () => void;
  todoList: TodoList;
}) {
  let clearCompletedButton;
  if (remaining.length !== todos.length) {
    clearCompletedButton = (
      <button className="clear-completed" onClick={clearCompleted}>
        Clear completed
      </button>
    );
  }

  const updateFilter = (filter: Filter) => TodoListMutations.filter(todoList, { filter }).save();

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong> {remaining.length ? remaining.length : '0'} </strong>
        {remaining.length === 1 ? 'item' : 'items'} left
      </span>
      <ul className="filters">
        <li>
          <a
            className={todoList.filter === 'all' ? 'selected' : ''}
            onClick={() => updateFilter('all')}
          >
            {' '}
            All{' '}
          </a>
        </li>
        <li>
          <a
            className={todoList.filter === 'active' ? 'selected' : ''}
            onClick={() => updateFilter('active')}
          >
            Active
          </a>
        </li>
        <li>
          <a
            className={todoList.filter === 'completed' ? 'selected' : ''}
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

export default function App({ list }: { list: TodoList }) {
  const clearCompleted = () => {};
  const startEditing = () => {};
  const remaining = [];
  let toggleAllCheck;

  // TODO: this'll be cumbersome until we add custom hooks and live queries.
  const [todos, setTodos] = useState<Todo[]>([]);
  useEffect(() => {
    list
      .queryTodos()
      .gen()
      .then(todos => {
        setTodos(todos);
      });
  }, []);

  if (todos.length) {
    toggleAllCheck = (
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
      <Header todoList={list} />
      <section className="main" style={todos.length ? {} : { display: 'none' }}>
        {toggleAllCheck}
        <ul className="todo-list">
          {todos.map(t => (
            <TodoView key={t.id} todo={t} editing={false} startEditing={startEditing} />
          ))}
        </ul>
        <Footer
          remaining={remaining}
          todos={todos}
          todoList={list}
          clearCompleted={clearCompleted}
        />
      </section>
    </div>
  );
}
