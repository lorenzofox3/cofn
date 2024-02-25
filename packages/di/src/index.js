const rootRegistry = {};
const registrySymbol = Symbol('registry');

export const provide = (providerFn) => (comp) =>
  function* ({ $host, ...rest }) {
    yield; // The element must be mounted, so we can look up the DOM tree
    $host[registrySymbol] = Object.assign(
      Object.create(
        $host.closest('[provider]')?.[registrySymbol] ?? rootRegistry,
      ),
      providerFn({ $host, ...rest }),
    );
    $host.toggleAttribute('provider');

    const instance = comp({
      $host,
      ...rest,
    });
    8;

    instance.next();

    yield* instance;
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
        const factoryLike = services[prop];
        const factory =
          typeof factoryLike === 'function' ? factoryLike : () => factoryLike;
        return factory(proxy);
      },
    });

    const instance = comp({ $host, services: proxy, ...rest });
    instance.next();
    yield* instance;
  };
