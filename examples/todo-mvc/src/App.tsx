import Todo, { Data as TodoData } from './generated/Todo.js';
import * as React from 'react';
import { useState } from 'react';
import { useQuery } from '@aphro/react';
import { UpdateType } from '@aphro/runtime-ts';
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
  const toggleTodo = () => {};

  if (editing) {
    body = <input type="text" className="edit" autoFocus value={todo.text} onChange={saveTodo} />;
  } else {
    body = (
      <div className="view">
        <input
          type="checkbox"
          className="toggle"
          checked={todo.completed != null}
          onClick={toggleTodo}
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

  const todoQuery = useQuery(UpdateType.ANY, () => list.queryTodos(), []);

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
          checked={remaining.length > 0}
          // onclick="toggleAll();"
        />
        <label>Mark all as complete</label>
      </>
    );
  }

  console.log(todos);
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
