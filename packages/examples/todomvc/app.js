import { define, withView } from 'dom';
import { TodoItemView } from './todo-item.view.js';
import { connectTodoService } from './todo-list.controller.js';
import { TodoListView } from './todo-list.view.js';
import { AddTodoView } from './add-todo.view.js';
import { injectTodoService } from './todo.service.js';
import { todoListControls } from './todo-list-controls.js';

const compose = (fns) => (arg) => fns.reduceRight((y, fn) => fn(y), arg);

const connectWithView = compose([connectTodoService, withView]);

define('app-todo', withView(TodoItemView), {
  shadow: { mode: 'closed' },
  observedAttributes: ['completed'],
});
define('app-todo-list', connectWithView(TodoListView));
define('app-add-todo', injectTodoService(withView(AddTodoView)));
define('app-controls', connectWithView(todoListControls), {
  extends: 'header',
});
