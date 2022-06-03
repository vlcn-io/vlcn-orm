import Todo, { Data as TodoData } from './generated/Todo.js';
import * as React from 'react';
import { useState } from 'react';
import { useBind, useQuery } from '@aphro/react';
import { P, UpdateType } from '@aphro/runtime-ts';
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
  const saveTodo = () => {};
  const deleteTodo = () => {};
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
  const clearCompleted = () => {};
  const startEditing = () => {};
  const toggleAll = () => {};
  const remaining = 0;
  const totalTodos = 1;
  let toggleAllCheck;

  useBind(list, ['filter']);
  // TODO: can we be smarter about the dep and understand if it is a
  // getter for a model? If thats the case we can bind on our own.
  const todoQuery = useQuery(
    UpdateType.ANY,
    () => {
      if (list.filter === 'all') {
        return list.queryTodos();
      }

      return list
        .queryTodos()
        .whereCompleted(list.filter === 'active' ? P.equals(null) : P.notEqual(null));
    },
    [list.filter],
  );

  if (todoQuery.status === 'loading') {
    return <div>Loading...</div>;
  }

  if (todoQuery.status === 'error') {
    return <div>Error...</div>;
  }

  const todos = todoQuery.data;

  if (todos.length) {
    toggleAllCheck = (
      <>
        <input
          type="checkbox"
          className="toggle-all"
          checked={remaining > 0}
          onChange={toggleAll}
        />
        <label>Mark all as complete</label>
      </>
    );
  }

  return (
    <div className="todoapp">
      <Header todoList={list} />
      <section className="main" style={totalTodos ? {} : { display: 'none' }}>
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
