import { define } from '@cofn/core';
import { uiIcon } from './components/ui-icon.js';
import './products/page.js';
import { PageLink } from './router/page-link.component.js';
import { PageOutlet } from './router/page-outlet.component.js';
import { navigationEvents } from './router/router.js';

const useLogger = (ctx, next) => {
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
  define('ui-page-outlet', withRoot(PageOutlet));

  const usePageLoader =
    ({ pagePath }) =>
    async (ctx, next) => {
      const module = await import(pagePath);
      const page = await module.loadPage({ state: ctx.state, router });
      router.emit({
        type: navigationEvents.PAGE_LOADED,
        detail: { page },
      });
      return next();
    };

  router
    .addRoute({ pattern: 'me' }, [
      useLogger,
      usePageLoader({ pagePath: '/not-available.page.js' }),
    ])
    .addRoute({ pattern: 'dashboard' }, [
      useLogger,
      usePageLoader({ pagePath: '/not-available.page.js' }),
    ])
    .addRoute({ pattern: 'products' }, [
      useLogger,
      usePageLoader({ pagePath: '/products/page.js' }),
    ])
    .addRoute({ pattern: 'sales' }, [
      useLogger,
      usePageLoader({ pagePath: '/not-available.page.js' }),
    ])
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
