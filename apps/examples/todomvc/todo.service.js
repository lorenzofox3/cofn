import {
  addTodo,
  clearCompleted,
  removeTodo,
  toggleAll,
  toggleTodo,
} from './todo.model.js';
import { mapValues } from './utils.js';

const { localStorage } = window;

const createService = ({
  emitter = new EventTarget(),
  todos: initialTodos = [],
  filter: initialFilter = 'all',
} = {}) => {
  let todos = [...initialTodos];
  let filter = initialFilter;

  const getState = () => structuredClone({ todos, filter });

  const withEmitter = mapValues((method) => (args) => {
    todos = method({ ...args, todos });
    emitter.dispatchEvent(new CustomEvent('state-changed'));
  });

  return {
    addEventListener: (...args) => emitter.addEventListener(...args),
    getState,
    ...withEmitter({
      addTodo,
      removeTodo,
      toggleTodo,
      clearCompleted,
      toggleAll,
    }),
    updateFilter({ filter: newFilter }) {
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
  (fn) =>
  (arg = {}) =>
    fn({
      ...arg,
      todoService: defaultImpl,
    });
