import { TodoService } from '../todo.service.ts';
import { ViewFactory } from '@cofn/view';

export const AddTodoView: ViewFactory<{ todoService: TodoService }> = ({
  html,
  todoService,
}) => {
  const handleSubmit = (ev) => {
    ev.preventDefault();
    const { target: form } = ev;
    const content = form.elements.namedItem('new-content').value;
    todoService.addTodo({ content });
    form.reset();
  };

  return () =>
    html` <form id="add-todo-form" @submit="${handleSubmit}">
      <label for="add-todo-input">What needs to be done ?</label>
      <div id="add-todo-controls">
        <input
          id="add-todo-input"
          placeholder="ex: build a todo app"
          autofocus
          required
          name="new-content"
          type="text"
        />
        <button><ui-icon name="plus-circle"></ui-icon>add</button>
      </div>
    </form>`;
};
