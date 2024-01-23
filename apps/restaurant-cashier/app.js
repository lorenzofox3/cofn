import { define } from '@cofn/core';
import { UIIcon } from './components/ui-icon.js';
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
import { compose } from './utils/functions.js';
import { mapValues } from './utils/objects.js';
import { UILabel } from './components/ui-label.js';
import { notificationsService } from './utils/notifications.service.js';
import { UIAlert } from './components/ui-alert.js';

const togglePreferences = ({ motion, theme }) => {
  const classList = querySelector('body').classList;
  classList.toggle('dark', theme === themeSettings.dark);
  classList.toggle('motion-reduced', motion === motionSettings.reduced);
};

export const createApp = ({ router }) => {
  const storageService = createStorageService();
  const preferencesService = createPreferencesService({
    storageService,
  });
  const animationService = createAnimationsService({
    preferencesService,
  });

  preferencesService.on(
    preferencesEvents.PREFERENCES_CHANGED,
    compose([
      togglePreferences,
      mapValues(({ computed }) => computed),
      preferencesService.getState,
    ]),
  );

  const root = {
    animationService,
    router,
    storageService,
    preferencesService,
    notificationsService,
  };
  const withRoot = (comp) =>
    function* (deps) {
      yield* comp({
        ...root,
        ...deps,
      });
    };

  const _define = (tag, comp, ...rest) => define(tag, withRoot(comp), ...rest);

  _define('ui-icon', UIIcon, {
    shadow: { mode: 'open' },
    observedAttributes: ['name'],
  });
  _define('ui-label', UILabel, {
    extends: 'label',
  });
  _define('ui-page-link', PageLink, {
    extends: 'a',
  });
  _define('ui-page-outlet', PageOutlet);
  _define('ui-alert', UIAlert, {
    shadow: {
      mode: 'open',
    },
  });

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
      usePageLoader({ pagePath: '/users/me.page.js' }),
    ])
    .addRoute({ pattern: 'dashboard' }, [
      usePageLoader({ pagePath: '/not-available.page.js' }),
    ])
    .addRoute({ pattern: 'products' }, [
      usePageLoader({ pagePath: '/products/product-list.page.js' }),
    ])
    .addRoute({ pattern: 'products/new' }, [
      usePageLoader({ pagePath: '/products/new-product.page.js' }),
    ])
    .addRoute({ pattern: 'products/:product-sku' }, [
      usePageLoader({ pagePath: '/products/edit-product.page.js' }),
    ])
    .addRoute({ pattern: 'sales' }, [
      usePageLoader({ pagePath: '/not-available.page.js' }),
    ])
    .notFound(() => {
      router.redirect('/products');
    });

  // trigger initial preference state
  preferencesService.emit({
    type: preferencesEvents.PREFERENCES_CHANGED,
  });

  return {
    start() {
      router.redirect(location.pathname + location.search + location.hash);
    },
  };
};

const useLogger = (ctx, next) => {
  console.debug(`loading route: ${ctx.state.navigation?.URL}`);
  return next();
};
