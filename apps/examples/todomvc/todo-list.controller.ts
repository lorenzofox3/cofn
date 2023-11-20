import { injectTodoService } from './todo.service.ts';
export const connectTodoService = (comp) => {
  return injectTodoService(connector);
  function* connector({ $signal, todoService, $host, ...deps }) {
    const { render: _render } = $host;

    $host.render = (args = {}) =>
      _render({
        ...args,
        state: todoService.getState(),
      });

    todoService.addEventListener('state-changed', $host.render, {
      signal: $signal,
    });

    yield* comp({ $signal, $host, todoService, ...deps });
  }
};
