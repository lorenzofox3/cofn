import { define } from '@cofn/core';
import { uiIcon } from './components/ui-icon.js';
import './products/product-list.page.js';
import { PageLink } from './router/page-link.component.js';
import { PageOutlet } from './router/page-outlet.component.js';
import { navigationEvents } from './router/router.js';
import { createAnimationsService } from './utils/animations.service.js';
import { createStorageService } from './utils/storage.service.js';
import {
  createPreferencesService,
  motionSettings,
  preferencesEvents,
  themeSettings,
} from './users/preferences.service.js';
import { querySelector } from './utils/dom.js';

const useLogger = (ctx, next) => {
  console.debug(`loading route: ${ctx.state.navigation?.URL}`);
  return next();
};

const togglePreferences = ({ motion, theme }) => {
  const classList = querySelector('body').classList;
  classList.toggle('dark', theme === themeSettings.DARK);
  classList.toggle('motion-reduced', motion === motionSettings.REDUCED);
};

export const createApp = ({ router }) => {
  const storageService = createStorageService();
  const preferencesService = createPreferencesService({
    storageService,
  });

  preferencesService.on(preferencesEvents.PREFERENCES_CHANGED, () =>
    togglePreferences(preferencesService.getState()),
  );

  const animationService = createAnimationsService({
    preferencesService,
  });
  const root = {
    animationService,
    router,
    storageService,
    preferenceService: preferencesService,
  };
  const withRoot = (comp) =>
    function* (deps) {
      yield* comp({
        ...root,
        ...deps,
      });
    };

  const _define = (tag, comp, ...rest) => define(tag, withRoot(comp), ...rest);

  _define('ui-icon', uiIcon, {
    shadow: { mode: 'open' },
    observedAttributes: ['name'],
  });
  _define('ui-page-link', PageLink, {
    extends: 'a',
  });
  _define('ui-page-outlet', PageOutlet);

  const usePageLoader =
    ({ pagePath }) =>
    async (ctx, next) => {
      const module = await import(pagePath);
      const page = await module.loadPage({
        state: ctx.state,
        ...root,
        define: _define,
      });
      router.emit({
        type: navigationEvents.PAGE_LOADED,
        detail: { page },
      });
      return next();
    };

  router
    .addRoute({ pattern: 'me' }, [
      useLogger,
      usePageLoader({ pagePath: '/users/me.page.js' }),
    ])
    .addRoute({ pattern: 'dashboard' }, [
      useLogger,
      usePageLoader({ pagePath: '/not-available.page.js' }),
    ])
    .addRoute({ pattern: 'products' }, [
      useLogger,
      usePageLoader({ pagePath: '/products/product-list.page.js' }),
    ])
    .addRoute({ pattern: 'products/new' }, [
      useLogger,
      usePageLoader({ pagePath: '/products/new-product.page.js' }),
    ])
    .addRoute({ pattern: 'sales' }, [
      useLogger,
      usePageLoader({ pagePath: '/not-available.page.js' }),
    ])
    .notFound(() => {
      router.redirect('/products');
    });

  preferencesService.emit({
    type: preferencesEvents.PREFERENCES_CHANGED,
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
