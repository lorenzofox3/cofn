import { define } from '@cofn/core';
import { uiIcon } from './components/ui-icon.js';
import './products/product-list.page.js';
import { PageLink } from './router/pag-link.component.js';
import { navigationEvents } from './router/router.js';

const userLogger = (ctx, next) => {
  console.debug(`loading route: ${ctx.state.navigation?.URL}`);
  return next();
};

export const createApp = ({ router }) => {
  const withRoot = (comp) =>
    function* (deps) {
      yield* comp({
        router,
        ...deps,
      });
    };

  define('ui-icon', uiIcon, {
    shadow: { mode: 'open' },
    observedAttributes: ['name'],
  });
  define('ui-page-link', withRoot(PageLink), {
    extends: 'a',
  });

  router.on(navigationEvents.ROUTE_CHANGE_SUCCEEDED, () => {
    console.log('in here');
  });

  router
    .addRoute({ pattern: 'me' }, [userLogger])
    .addRoute({ pattern: 'dashboard' }, [userLogger])
    .addRoute({ pattern: 'products' }, [userLogger])
    .addRoute({ pattern: 'sales' }, [userLogger])
    .notFound(() => {
      router.redirect('/products');
    });
  return {
    start() {
      router.redirect(location.pathname + location.search + location.hash);
    },
  };
};

// service worker
const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        './service-worker.js',
        { type: 'module' },
      );
      if (registration.installing) {
        console.log('Service worker installing');
      } else if (registration.waiting) {
        console.log('Service worker installed');
      } else if (registration.active) {
        console.log('Service worker active');
      }
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  }
};

registerServiceWorker();
