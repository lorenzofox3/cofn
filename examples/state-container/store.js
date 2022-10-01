import { createStore } from './state-container.js';

const initialState = {
  counter: 0,
};

const actionsTable = {
  increment(state, { amount = 1 }) {
    return {
      ...state,
      counter: state.counter + amount,
    };
  },
  decrement(state, { amount = 1 }) {
    return {
      ...state,
      counter: state.counter - amount,
    };
  },
};

export const store = createStore({
  actionsTable,
  initialState,
});
