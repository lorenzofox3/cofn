import { createInjector, factorify } from './injector.js';

const rootRegistry = {};
const registrySymbol = Symbol('registry');
export const provide = (providerFn) => (comp) => {
  const _providerFn = factorify(providerFn);
  return function* ({ $host, ...rest }) {
    yield; // The element must be mounted, so we can look up the DOM tree
    $host[registrySymbol] = Object.assign(
      Object.create(
        $host.closest('[provider]')?.[registrySymbol] ?? rootRegistry,
      ),
      _providerFn({ $host, ...rest }),
    );
    $host.toggleAttribute('provider');

    const instance = comp({
      $host,
      ...rest,
    });

    instance.next();

    yield* instance;
  };
};

export const inject = (comp) =>
  function* ({ $host, ...rest }) {
    yield; // The element must be mounted, so we can look up the DOM tree
    const services = createInjector({
      services: $host.closest('[provider]')?.[registrySymbol] ?? rootRegistry,
    });
    const instance = comp({ $host, services, ...rest });
    instance.next();
    yield* instance;
  };
