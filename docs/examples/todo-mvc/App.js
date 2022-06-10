import * as React from 'react';
import { useState } from 'react';
import { unwraps, useBind, useQuery } from '@aphro/react';
import { commit, P, UpdateType } from '@aphro/runtime-ts';
import TodoListMutations from './generated/TodoListMutations.js';
import TodoMutations from './generated/TodoMutations.js';
function Header({ todoList }) {
    const [newText, setNewText] = useState('');
    return (React.createElement("header", { className: "header" },
        React.createElement("h1", null, "todos"),
        React.createElement("input", { type: "text", className: "new-todo", placeholder: "What needs to be done?", autoFocus: true, value: newText, onChange: e => setNewText(e.target.value), onKeyUp: e => {
                const target = e.target;
                if (e.key === 'Enter' && target.value.trim() !== '') {
                    TodoMutations.create(todoList.ctx, {
                        text: target.value,
                        listId: todoList.id,
                    }).save();
                    setNewText('');
                }
            } })));
}
function TodoView({ todo, editing, startEditing, saveTodo, }) {
    let body;
    const [text, setText] = useState(todo.text);
    const deleteTodo = () => TodoMutations.delete(todo, {}).save();
    const toggleTodo = () => TodoMutations.toggleComplete(todo, { completed: todo.completed }).save();
    if (editing) {
        body = (React.createElement("input", { type: "text", className: "edit", autoFocus: true, value: text, onBlur: () => saveTodo(todo, text), onKeyUp: e => e.key === 'Enter' && saveTodo(todo, text), onChange: e => setText(e.target.value) }));
    }
    else {
        body = (React.createElement("div", { className: "view" },
            React.createElement("input", { type: "checkbox", className: "toggle", checked: todo.completed != null, onChange: toggleTodo }),
            React.createElement("label", { onDoubleClick: () => startEditing(todo) }, todo.text),
            React.createElement("button", { className: "destroy", onClick: deleteTodo })));
    }
    return (React.createElement("li", { className: (todo.completed != null ? 'completed ' : '') + (editing ? 'editing' : '') }, body));
}
function Footer({ remaining, todos, clearCompleted, todoList, }) {
    let clearCompletedButton;
    if (remaining !== todos.length) {
        clearCompletedButton = (React.createElement("button", { className: "clear-completed", onClick: clearCompleted }, "Clear completed"));
    }
    const updateFilter = (filter) => TodoListMutations.filter(todoList, { filter }).save();
    return (React.createElement("footer", { className: "footer" },
        React.createElement("span", { className: "todo-count" },
            React.createElement("strong", null,
                " ",
                remaining,
                " "),
            remaining === 1 ? 'item' : 'items',
            " left"),
        React.createElement("ul", { className: "filters" },
            React.createElement("li", null,
                React.createElement("a", { className: todoList.filter === 'all' ? 'selected' : '', onClick: () => updateFilter('all') },
                    ' ',
                    "All",
                    ' ')),
            React.createElement("li", null,
                React.createElement("a", { className: todoList.filter === 'active' ? 'selected' : '', onClick: () => updateFilter('active') }, "Active")),
            React.createElement("li", null,
                React.createElement("a", { className: todoList.filter === 'completed' ? 'selected' : '', onClick: () => updateFilter('completed') }, "Completed"))),
        clearCompletedButton));
}
export default function App({ list }) {
    const clearCompleted = () => commit(list.ctx, completeTodos.map(t => TodoMutations.delete(t, {}).toChangeset()));
    const startEditing = (todo) => TodoListMutations.edit(list, { editing: todo.id }).save();
    const saveTodo = (todo, text) => {
        commit(list.ctx, TodoMutations.changeText(todo, { text: text }).toChangeset(), TodoListMutations.edit(list, { editing: null }).toChangeset());
    };
    const toggleAll = () => {
        if (remaining === 0) {
            // uncomplete all
            commit(list.ctx, completeTodos.map(t => TodoMutations.setComplete(t, { completed: null }).toChangeset()));
        }
        else {
            // complete all
            commit(list.ctx, activeTodos.map(t => TodoMutations.setComplete(t, { completed: Date.now() }).toChangeset()));
        }
    };
    let toggleAllCheck;
    useBind(list, ['filter', 'editing']);
    const [activeTodos, completeTodos, allTodos] = unwraps(useQuery(UpdateType.ANY, () => list.queryTodos().whereCompleted(P.equals(null)), []), useQuery(UpdateType.ANY, () => list.queryTodos().whereCompleted(P.notEqual(null)), []), useQuery(UpdateType.CREATE_OR_DELETE, () => list.queryTodos(), []));
    const remaining = activeTodos.length;
    let todos = list.filter === 'active' ? activeTodos : list.filter === 'completed' ? completeTodos : allTodos;
    if (allTodos.length) {
        toggleAllCheck = (React.createElement(React.Fragment, null,
            React.createElement("input", { id: "toggle-all", type: "checkbox", className: "toggle-all", checked: remaining === 0, onChange: toggleAll }),
            React.createElement("label", { htmlFor: "toggle-all" }, "Mark all as complete")));
    }
    return (React.createElement("div", { className: "todoapp" },
        React.createElement(Header, { todoList: list }),
        React.createElement("section", { className: "main", style: allTodos.length > 0 ? {} : { display: 'none' } },
            toggleAllCheck,
            React.createElement("ul", { className: "todo-list" }, todos.map(t => (React.createElement(TodoView, { key: t.id, todo: t, editing: list.editing === t.id, startEditing: startEditing, saveTodo: saveTodo })))),
            React.createElement(Footer, { remaining: remaining, todos: allTodos, todoList: list, clearCompleted: clearCompleted }))));
}
//# sourceMappingURL=App.js.map