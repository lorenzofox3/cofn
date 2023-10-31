import { define, withView } from 'dom';
import { TodoItemView } from './views/todo-item.view.js';
import { connectTodoService } from './todo-list.controller.js';
import { TodoListView } from './views/todo-list.view.js';
import { AddTodoView } from './views/add-todo.view.js';
import { injectTodoService } from './todo.service.js';
import { todoListControlsView } from './views/todo-list-controls.view.js';
import { compose } from './utils.js';

const connectWithView = compose([connectTodoService, withView]);

define('app-todo', withView(TodoItemView), {
  shadow: { mode: 'closed' },
  observedAttributes: ['completed'],
});
define('app-todo-list', connectWithView(TodoListView));
define('app-add-todo', injectTodoService(withView(AddTodoView)));
define('app-controls', connectWithView(todoListControlsView), {
  extends: 'header',
});
