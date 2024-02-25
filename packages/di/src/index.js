const rootRegistry = {};
const registrySymbol = Symbol('registry');

const factorify = (factoryLike) =>
  typeof factoryLike === 'function' ? factoryLike : () => factoryLike;

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
    const services =
      $host.closest('[provider]')?.[registrySymbol] ?? rootRegistry;
    const proxy = new Proxy(services, {
      get(target, prop, receiver) {
        if (!Reflect.has(services, prop)) {
          throw new Error(`could not resolve injectable "${prop}"`);
        }
        const factory = factorify(services[prop]);
        return factory(proxy);
      },
    });

    const instance = comp({ $host, services: proxy, ...rest });
    instance.next();
    yield* instance;
  };
