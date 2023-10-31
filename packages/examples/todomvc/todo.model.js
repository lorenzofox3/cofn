import { not } from './utils.js';

const isCompleted = ({ completed }) => completed;
export const getModelFromState = ({ todos, filter = 'all' }) => {
  const toBeCompletedCount = todos.filter(({ completed }) => !completed).length;
  const hasAnyCompleted = toBeCompletedCount < todos.length;
  return {
    displayedItems:
      filter === 'all'
        ? todos
        : filter === 'completed'
        ? todos.filter(isCompleted)
        : todos.filter(not(isCompleted)),
    toBeCompletedCount,
    hasAnyCompleted,
    hasAnyItem: todos.length > 0,
    areAllCompleted: toBeCompletedCount === 0 && hasAnyCompleted,
  };
};

const generateNewId = ({ todos }) =>
  Math.max(0, ...todos.map(({ id }) => id)) + 1;
export const addTodo = ({ content, todos, newId = generateNewId }) => [
  ...todos,
  { content, id: newId({ todos }), completed: false },
];

export const removeTodo = ({ todos, id }) =>
  todos.filter(({ id: todoId }) => todoId !== id);

export const toggleTodo = ({ todos, id }) =>
  todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo,
  );
