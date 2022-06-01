import Todo from './generated/Todo.js';
import React from 'react';

function Header() {
  return (
    <header className="header">
      <h1>todos</h1>
      <input type="text" className="new-todo" placeholder="What needs to be done?" autoFocus />
    </header>
  );
}

function TodoView({}: { key?: any; item: Todo }) {
  return <div></div>;
}

function Footer() {
  return <div></div>;
}

export default function App() {
  const state: { items: Todo[] } = {
    items: [],
  };
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
            <TodoView key={t.id} item={t} />
          ))}
        </ul>
        <Footer remaining={remaining} todos={state.items} />
      </section>
    </div>
  );
}
