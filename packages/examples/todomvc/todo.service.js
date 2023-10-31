import { addTodo, removeTodo, toggleTodo } from './todo.model.js';

const mapValues = (mapFn) => (obj) =>
  Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, mapFn(value)]),
  );

const createService = ({ emitter = new EventTarget() } = {}) => {
  let todos = [];

  const getState = () => ({
    todos: structuredClone(todos),
  });

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
    }),
  };
};

const defaultImpl = createService();

export const injectTodoService =
  (fn) =>
  (arg = {}) =>
    fn({
      ...arg,
      todoService: defaultImpl,
    });
