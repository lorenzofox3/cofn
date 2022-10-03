import { store } from './store.js';
import * as actions from './actions.js';
import { withInjectables } from '../../src/index.js';

export const connectToStore = (comp) => {
  return function* ({ $el, ...restInjected }) {
    const { render } = $el;

    $el.render = (arg = {}) =>
      render({
        ...arg,
        state: store.getState(),
      });

    const unsubscribe = store.subscribe($el.render);

    try {
      yield* comp({ $el, ...restInjected });
    } finally {
      unsubscribe();
    }
  };
};

export const withStore = withInjectables({ store, actions });
