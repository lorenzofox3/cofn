import { getModelFromState } from '../todo.model.ts';
import { TodoService, TodoServiceState } from '../todo.service.ts';
import { ViewFactory } from '@cofn/view';
export const TodoListView: ViewFactory<
  { todoService: TodoService },
  { state: TodoServiceState }
> = ({ html, todoService, $host, $signal }) => {
  bind('todo-toggled', todoService.toggleTodo);
  bind('todo-removed', (detail) => {
    todoService.removeTodo(detail);
    $host.focus();
  });
  const treeWalker = document.createTreeWalker($host, NodeFilter.SHOW_ELEMENT);
  $host.addEventListener('keydown', handleKeydown, { signal: $signal });
  $host.addEventListener('focus', handleFocus, { signal: $signal });

  return ({ state }) => {
    const { displayedItems = [] } = getModelFromState(state);

    return html` ${displayedItems.map(
      (todo) =>
        html`${todo.id}::<app-todo
            tabindex="-1"
            data-id="${todo.id}"
            completed="${todo.completed}"
            >${todo.content}</app-todo
          >`,
    )}`;
  };

  function bind(eventName, listener) {
    $host.addEventListener(eventName, ({ detail }) => listener(detail), {
      signal: $signal,
    });
  }

  function handleKeydown({ key }) {
    if (key === 'ArrowDown' || key === 'ArrowUp') {
      const node =
        key === 'ArrowDown' ? treeWalker.nextNode() : treeWalker.previousNode();
      treeWalker.currentNode = node || treeWalker.currentNode;
      // todo
      // @ts-ignore
      treeWalker.currentNode.focus();
    }
  }

  function handleFocus() {
    treeWalker.currentNode = $host;
  }
};
