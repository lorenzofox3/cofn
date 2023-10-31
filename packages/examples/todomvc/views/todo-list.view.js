import { getModelFromState } from '../todo.model.js';
export const TodoListView = ({ html, todoService, $host, $signal }) => {
  bind('todo-toggled', todoService.toggleTodo);
  bind('todo-removed', todoService.removeTodo);

  return ({ state }) => {
    const { displayedItems = [] } = getModelFromState(state);

    return html` ${displayedItems.map(
      (todo) =>
        html`${todo.id}::
          <app-todo data-id="${todo.id}" completed="${todo.completed}"
            >${todo.content}</app-todo
          >`,
    )}`;
  };

  function bind(eventName, listener) {
    $host.addEventListener(eventName, ({ detail }) => listener(detail), {
      signal: $signal,
    });
  }
};
