import { store } from './store.js';

export const increment = () => {
  store.dispatch({
    type: 'increment',
  });
};

export const decrement = () => {
  store.dispatch({
    type: 'decrement',
  });
};
