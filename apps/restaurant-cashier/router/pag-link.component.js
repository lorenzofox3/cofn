import { navigationEvents } from './router.js';

export const connectToRouter = (component) =>
  function* ({ router, $host, $signal, ...rest }) {
    router.on(
      navigationEvents.ROUTE_CHANGE_SUCCEEDED,
      ({ detail }) => {
        const isCurrent = $host
          .getAttribute('href')
          .includes(new URL(detail.requestedURL).pathname);
        $host.render({ isCurrent });
      },
      { signal: $signal },
    );

    $host.addEventListener(
      'click',
      (ev) => {
        ev.preventDefault();
        router.goTo($host.getAttribute('href'));
      },
      { signal: $signal },
    );

    yield* component({ router, $host, $signal, ...rest });
  };

export const PageLink = connectToRouter(function* ({ $host }) {
  while (true) {
    const { isCurrent = false } = yield;
    $host.removeAttribute('aria-current');
    if (isCurrent === true) {
      $host.setAttribute('aria-current', 'page');
    }
  }
});
