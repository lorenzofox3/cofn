import {
  injectTodoService,
  TodoService,
  TodoServiceState,
} from './todo.service.ts';
import { ComponentDependencies, ComponentRoutine } from '@cofn/core';
export const connectTodoService = (
  comp: ComponentRoutine<
    { todoService: TodoService },
    { state: TodoServiceState }
  >,
) => {
  return injectTodoService(connector);
  function* connector({
    $signal,
    todoService,
    $host,
    ...deps
  }: ComponentDependencies<{ todoService: TodoService }>) {
    const { render: _render } = $host;

    $host.render = (args?) =>
      _render({
        ...(args ?? {}),
        state: todoService.getState(),
      });

    todoService.addEventListener('state-changed', $host.render, {
      signal: $signal,
    });

    yield* comp({ $signal, $host, todoService, ...deps });
  }
};
