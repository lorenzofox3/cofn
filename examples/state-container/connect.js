import { store } from './store.js';
import * as actions from './actions.js';

export const connectToStore = (comp) => {
  return function* ({ update, ...restInjected }) {
    let forwarded;

    const newUpdate = (arg = {}) =>
      update({
        ...arg,
        state: store.getState(),
      });

    const unsubscribe = store.subscribe(() => {
      newUpdate();
    });

    const it = comp({ ...restInjected, update: newUpdate });
    const next = ({ state = store.getState(), ...rest } = {}) =>
      it.next({ state, ...rest }).value;

    try {
      while (true) {
        forwarded = yield next(forwarded);
      }
    } finally {
      unsubscribe();
    }
  };
};

export const withStore = (comp) =>
  function* (args = {}) {
    yield* comp({ ...args, actions, store });
  };
