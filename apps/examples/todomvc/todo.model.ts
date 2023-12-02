import { not } from './utils.ts';

export type Todo = {
  id: number;
  content: string;
  completed: boolean;
};

export type Filter = 'all' | 'completed' | 'to-be-done';
const isCompleted = ({ completed }: Todo) => completed;
export const getModelFromState = ({
  todos,
  filter = 'all',
}: {
  todos: Todo[];
  filter?: Filter;
}) => {
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
    filter,
  };
};

const generateNewId = ({ todos }: { todos: Todo[] }) =>
  Math.max(0, ...todos.map(({ id }) => id)) + 1;
export const addTodo = ({
  content,
  todos,
  newId = generateNewId,
}: {
  content: string;
  todos: Todo[];
  newId?: ({ todos }: { todos: Todo[] }) => number;
}) => [...todos, { content, id: newId({ todos }), completed: false }];

export const removeTodo = ({ todos, id }: { todos: Todo[]; id: number }) =>
  todos.filter(({ id: todoId }) => todoId !== id);

export const toggleTodo = ({ todos, id }: { todos: Todo[]; id: number }) =>
  todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo,
  );

export const clearCompleted = ({ todos }: { todos: Todo[] }) =>
  todos.filter(not(isCompleted));

export const toggleAll = ({ todos }: { todos: Todo[] }) => {
  const { areAllCompleted } = getModelFromState({ todos });
  return todos.map((todo) => ({
    ...todo,
    completed: !areAllCompleted,
  }));
};
