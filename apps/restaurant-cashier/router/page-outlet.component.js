import { navigationEvents } from './router.js';

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

export const PageOutlet = pageOutlet(function* ({ $host }) {
  while (true) {
    const { page } = yield;
    if (page) {
      $host.replaceChildren(page);
      const elToFocus =
        $host.querySelector('[autofocus]') || $host.querySelector('h1');
      elToFocus?.focus();
    }
  }
});
