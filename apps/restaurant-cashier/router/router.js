import { composeStack, createContext } from './utils.js';
import { createTrie } from './trie.js';
import { createEventEmitter } from '../utils/events.js';

export const navigationEvents = {
  ROUTE_CHANGE_STARTED: 'ROUTE_CHANGE_STARTED',
  ROUTE_CHANGE_SUCCEEDED: 'ROUTE_CHANGE_SUCCEEDED',
  ROUTE_CHANGE_FAILED: 'ROUTE_CHANGE_FAILED',
};

export const createRouter = ({ global = window } = {}) => {
  let notFoundHandler = global.console.error;
  const origin = global.location.origin;
  const trie = createTrie();
  const routes = {};

  const service = Object.assign(createEventEmitter(), {
    goTo(route, data = {}) {
      const newURL = new URL(route, origin);
      const state = { ...data, navigation: { URL: newURL.href } };
      global.history.pushState(state, '', newURL.href);
      global.dispatchEvent(new PopStateEvent('popstate', { state }));
    },
    redirect(route, data = {}) {
      const newURL = new URL(route, origin);
      const state = { ...data, navigation: { URL: newURL.href } };
      global.history.replaceState(state, '', newURL.href);
      global.dispatchEvent(new PopStateEvent('popstate', { state }));
    },
    addRoute(routeDef, stack = []) {
      trie.insert(routeDef.pattern);
      routes[routeDef.pattern] = {
        ...routeDef,
        handler: composeStack([...stack, emitSuccess]),
      };
      return this;
    },
    notFound(fn) {
      notFoundHandler = fn;
      return this;
    },
  });

  global.addEventListener('popstate', handlePopState);

  return Object.create(service, {
    origin: { value: origin, enumerable: true },
  });

  async function handlePopState({ state = {} }) {
    try {
      const requestedURL = state.navigation?.URL ?? origin;
      const pathName = new URL(requestedURL).pathname;

      service.emit(navigationEvents.ROUTE_CHANGE_STARTED, {
        requestedURL,
        state,
      });

      const { match } = trie.search(pathName);
      const routeDef = routes?.[match] ?? { handler: notFoundHandler };
      const context = createContext({
        state,
        routeDef,
        router: service,
      });
      await routeDef.handler(context);
    } catch (error) {
      service.emit(navigationEvents.ROUTE_CHANGE_FAILED, {
        error,
      });
    }
  }
};

function emitSuccess(ctx) {
  const { state, router } = ctx;
  router.emit({
    type: navigationEvents.ROUTE_CHANGE_SUCCEEDED,
    detail: {
      requestedURL: state?.navigation?.URL,
      state,
    },
  });
}
