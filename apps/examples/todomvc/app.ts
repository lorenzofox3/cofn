import { define } from '@cofn/core';
import { withView } from '@cofn/view';
import { TodoItemView } from './views/todo-item.view.js';
import { connectTodoService } from './todo-list.controller.js';
import { TodoListView } from './views/todo-list.view.js';
import { AddTodoView } from './views/add-todo.view.ts';
import {
  injectTodoService,
  TodoService,
  TodoServiceState,
} from './todo.service.ts';
import { todoListControlsView } from './views/todo-list-controls.view.js';
import { compose } from './utils.js';

const connectWithView = compose([
  connectTodoService,
  withView<{ todoService: TodoService }, { state: TodoServiceState }>,
]);

define('app-todo', withView(TodoItemView), {
  shadow: { mode: 'open', delegatesFocus: true },
  observedAttributes: ['completed'],
});
define('app-todo-list', connectWithView(TodoListView));
define('app-add-todo', injectTodoService(withView(AddTodoView)));
define('app-controls', connectWithView(todoListControlsView), {
  extends: 'header',
});
