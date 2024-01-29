import { navigationEvents } from './router.js';
import { motionSettings } from '../users/preferences.service.js';

const pageOutlet = (component) =>
  function* ({ router, $host, $signal, ...rest }) {
    const render = $host.render.bind($host);
    router.on(
      navigationEvents.PAGE_LOADED,
      ({ detail }) => render({ ...detail }),
      { signal: $signal },
    );

    yield* component({
      $host,
      $signal,
      router,
      ...rest,
    });
  };

export const PageOutlet = pageOutlet(function* ({ $host, preferencesService }) {
  while (true) {
    const { page } = yield;
    if (page) {
      const { motion } = preferencesService.getState();
      const autofocusElement = page.querySelector('[autofocus]');
      if (
        !document.startViewTransition ||
        motion?.computed === motionSettings.reduced
      ) {
        updateDOM({ page });
        const elToFocus = autofocusElement || $host.querySelector('h1');
        elToFocus?.focus();
      } else {
        const transition = document.startViewTransition(() => {
          updateDOM({ page });
        });
        transition.updateCallbackDone.then(() => {
          const elToFocus = autofocusElement || $host.querySelector('h1');
          elToFocus?.focus();
        });
      }
    }
  }

  function updateDOM({ page }) {
    $host.replaceChildren(page);
  }
});
