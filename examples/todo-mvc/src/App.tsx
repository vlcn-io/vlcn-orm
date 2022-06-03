import Todo from './generated/Todo.js';
import * as React from 'react';
import { useState } from 'react';
import { unwraps, useBind, useQuery } from '@aphro/react';
import { commit, P, UpdateType } from '@aphro/runtime-ts';
import TodoList, { Data } from './generated/TodoList.js';
import TodoListMutations from './generated/TodoListMutations.js';
import TodoMutations from './generated/TodoMutations.js';

type Filter = Data['filter'];

function Header({ todoList }: { todoList: TodoList }) {
  const [newText, setNewText] = useState<string>('');
  return (
    <header className="header">
      <h1>todos</h1>
      <input
        type="text"
        className="new-todo"
        placeholder="What needs to be done?"
        autoFocus
        value={newText}
        onChange={e => setNewText(e.target.value)}
        onKeyUp={e => {
          if (e.key === 'Enter') {
            TodoMutations.create(todoList.ctx, {
              text: (e.target as HTMLInputElement).value,
              listId: todoList.id,
            }).save();
            setNewText('');
          }
        }}
      />
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
  // TODO: we need to re-enable optimistic updates + delayed persists.
  const saveTodo = () => {
    // commitDebounced();
  };
  const deleteTodo = () => TodoMutations.delete(todo, {}).save();
  const toggleTodo = () => TodoMutations.toggleComplete(todo, { completed: todo.completed }).save();

  if (editing) {
    body = <input type="text" className="edit" autoFocus value={todo.text} onChange={saveTodo} />;
  } else {
    body = (
      <div className="view">
        <input
          type="checkbox"
          className="toggle"
          checked={todo.completed != null}
          onChange={toggleTodo}
        />
        <label onDoubleClick={() => startEditing(todo)}>{todo.text}</label>
        <button className="destroy" onClick={deleteTodo} />
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
  remaining: number;
  todos: Todo[];
  clearCompleted: () => void;
  todoList: TodoList;
}) {
  let clearCompletedButton;
  if (remaining !== todos.length) {
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
        <strong> {remaining} </strong>
        {remaining === 1 ? 'item' : 'items'} left
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
  const clearCompleted = () =>
    commit(
      list.ctx,
      completeTodos.map(t => TodoMutations.delete(t, {}).toChangeset()),
    );
  const startEditing = (todo: Todo) => TodoListMutations.edit(list, { editing: todo.id }).save();
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
  let toggleAllCheck;

  useBind(list, ['filter']);
  const [activeTodos, completeTodos, allTodos] = unwraps(
    useQuery(UpdateType.ANY, () => list.queryTodos().whereCompleted(P.equals(null)), []),
    useQuery(UpdateType.ANY, () => list.queryTodos().whereCompleted(P.notEqual(null)), []),
    useQuery(UpdateType.CREATE_OR_DELETE, () => list.queryTodos(), []),
  );

  const remaining = activeTodos.length;
  let todos =
    list.filter === 'active' ? activeTodos : list.filter === 'completed' ? completeTodos : allTodos;

  if (allTodos.length) {
    toggleAllCheck = (
      <>
        <input
          id="toggle-all"
          type="checkbox"
          className="toggle-all"
          checked={remaining === 0}
          onChange={toggleAll}
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
      </>
    );
  }

  return (
    <div className="todoapp">
      <Header todoList={list} />
      <section className="main" style={allTodos.length > 0 ? {} : { display: 'none' }}>
        {toggleAllCheck}
        <ul className="todo-list">
          {todos.map(t => (
            <TodoView key={t.id} todo={t} editing={false} startEditing={startEditing} />
          ))}
        </ul>
        <Footer
          remaining={remaining}
          todos={allTodos}
          todoList={list}
          clearCompleted={clearCompleted}
        />
      </section>
    </div>
  );
}
