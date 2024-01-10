import { navigationEvents } from './router.js';

export const connectToRouter = (component) =>
  function* ({ router, $host, $signal, ...rest }) {
    const linkHref = $host.getAttribute('href');
    router.on(
      navigationEvents.ROUTE_CHANGE_SUCCEEDED,
      ({ detail }) => {
        const requestedPathname = new URL(detail.requestedURL).pathname;
        const isCurrent = requestedPathname.includes(linkHref);
        $host.render({ isCurrent });
      },
      { signal: $signal },
    );

    $host.addEventListener(
      'click',
      (ev) => {
        ev.preventDefault();
        router.goTo(linkHref);
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
