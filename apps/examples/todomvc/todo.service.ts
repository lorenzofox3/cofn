import {
  addTodo,
  clearCompleted,
  Filter,
  removeTodo,
  Todo,
  toggleAll,
  toggleTodo,
} from './todo.model.ts';
import { mapValues } from './utils.js';

const { localStorage } = window;

export type TodoServiceState = {
  filter: Filter;
  todos: Todo[];
};

export type TodoService = {
  addEventListener: EventTarget['addEventListener'];
  getState: () => TodoServiceState;
  updateFilter: ({ filter }: { filter: Filter }) => void;
  addTodo: (newTodo: { content: string }) => void;
  removeTodo: ({ id }: { id: number }) => void;
  toggleTodo: ({ id }: { id: number }) => void;
  toggleAll: (input?: Record<string, never>) => void;
  clearCompleted: (input?: Record<string, never>) => void;
};

type TodoMethod<Input extends { todos: Todo[] }> = (input: Input) => Todo[];

const createService = ({
  emitter = new EventTarget(),
  todos: initialTodos = [],
  filter: initialFilter = 'all',
}: Partial<TodoServiceState> & {
  emitter?: EventTarget;
} = {}): TodoService => {
  let todos = [...initialTodos];
  let filter: Filter = initialFilter;

  const getState = () => structuredClone({ todos, filter });

  const withEmitter = mapValues((method: TodoMethod<any>) => (args) => {
    todos = method({ ...args, todos });
    emitter.dispatchEvent(new CustomEvent('state-changed'));
  });

  return {
    addEventListener: (...args: Parameters<EventTarget['addEventListener']>) =>
      emitter.addEventListener(...args),
    getState,
    ...withEmitter({
      addTodo,
      removeTodo,
      toggleTodo,
      clearCompleted,
      toggleAll,
    }),
    updateFilter({ filter: newFilter }: { filter: Filter }) {
      filter = newFilter;
      emitter.dispatchEvent(new CustomEvent('state-changed'));
    },
  };
};

const initialState = JSON.parse(localStorage.getItem('state') || '{}');
const defaultImpl = createService(initialState);

defaultImpl.addEventListener('state-changed', () =>
  localStorage.setItem('state', JSON.stringify(defaultImpl.getState())),
);

export const injectTodoService =
  <T extends { todoService: TodoService }, K>(fn: (deps: T) => K) =>
  (arg?: Omit<T, 'todoService'>) =>
    fn({
      ...(arg ?? {}),
      todoService: defaultImpl,
    } as T);
