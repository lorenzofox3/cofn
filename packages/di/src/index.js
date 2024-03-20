import { createInjector, factorify } from './injector.js';

const rootRegistry = {};
const registrySymbol = Symbol('registry');
export const provide = (providerFn) => (comp) => {
  const _providerFn = factorify(providerFn);
  return function* ({ $host, ...rest }) {
    let input = yield; // The element must be mounted, so we can look up the DOM tree
    $host[registrySymbol] = Object.assign(
      Object.create(
        $host.closest('[provider]')?.[registrySymbol] ?? rootRegistry,
      ),
      _providerFn({ $host, ...rest }),
    );
    $host.toggleAttribute('provider');

    const instance = comp({
      $host,
      services: createInjector({
        services: $host[registrySymbol],
      }),
      ...rest,
    });

    instance.next(); // need to catch up as we defer instantiation
    try {
      while (true) {
        instance.next(input);
        input = yield;
      }
    } finally {
      instance.return();
    }
  };
};

export const inject = (comp) =>
  function* ({ $host, ...rest }) {
    let input = yield; // The element must be mounted, so we can look up the DOM tree
    const services = createInjector({
      services: $host.closest('[provider]')?.[registrySymbol] ?? rootRegistry,
    });
    const instance = comp({ $host, services, ...rest });
    try {
      instance.next(); // need to catch up as we defer instantiation
      while (true) {
        instance.next(input);
        input = yield;
      }
    } finally {
      instance.return();
    }
  };
