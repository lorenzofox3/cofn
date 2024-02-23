import { define } from '@cofn/core';
import { UIIcon } from './components/ui-icon.component.js';
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
import { UiLabelComponent } from './components/ui-label.component.js';
import { notificationsService } from './utils/notifications.service.js';
import { UIAlert } from './components/ui-alert.component.js';

const togglePreferences = ({ motion, theme }) => {
  const classList = querySelector('body').classList;
  classList.toggle('dark', theme === themeSettings.dark);
  classList.toggle('motion-reduced', motion === motionSettings.reduced);
};

// todo: we need to repeat the loading page or vite gets lost

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
  _define('ui-label', UiLabelComponent, {
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
  async function loadPage(ctx, next) {
    const page = await ctx.module.loadPage({
      state: ctx.state,
      ...root,
      define: _define,
    });
    router.emit({
      type: navigationEvents.PAGE_LOADED,
      detail: { page },
    });
    return next();
  }

  router
    .addRoute({ pattern: 'me' }, [
      async (ctx, next) => {
        ctx.module = await import('/users/me.page.js');
        next();
      },
      loadPage,
    ])
    .addRoute({ pattern: 'dashboard' }, [
      async (ctx, next) => {
        ctx.module = await import('/dashboard/dashboard.page.js');
        next();
      },
      loadPage,
    ])
    .addRoute({ pattern: 'products' }, [
      async (ctx, next) => {
        ctx.module = await import('/products/list/product-list.page.js');
        next();
      },
      loadPage,
    ])
    .addRoute({ pattern: 'products/new' }, [
      async (ctx, next) => {
        ctx.module = await import('/products/new/new-product.page.js');
        next();
      },
      loadPage,
    ])
    .addRoute({ pattern: 'products/:product-sku' }, [
      async (ctx, next) => {
        ctx.module = await import('/products/edit/edit-product.page.js');
        next();
      },
      loadPage,
    ])
    .addRoute({ pattern: 'cart' }, [
      async (ctx, next) => {
        ctx.module = await import('/cart/cart.page.js');
        next();
      },
      loadPage,
    ])
    .notFound(() => {
      router.redirect('/dashboard');
    });

  return {
    start() {
      // trigger initial preference state
      preferencesService.emit({
        type: preferencesEvents.PREFERENCES_CHANGED,
      });
      router.redirect(location.pathname + location.search + location.hash);
    },
  };
};

const useLogger = (ctx, next) => {
  console.debug(`loading route: ${ctx.state.navigation?.URL}`);
  return next();
};
