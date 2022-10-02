import { store } from './store.js';
import * as actions from './actions.js';
import { withInjectables } from '../../src/index.js';

export const connectToStore = (comp) => {
  return function* ({ $el, ...restInjected }) {
    let forwarded;

    const { render } = $el;

    $el.render = (arg = {}) =>
      render({
        ...arg,
        state: store.getState(),
      });

    const unsubscribe = store.subscribe($el.render);

    const it = comp({ $el, ...restInjected });
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

export const withStore = withInjectables({ store, actions });
