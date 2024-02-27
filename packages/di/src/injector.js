export const factorify = (factoryLike) =>
  typeof factoryLike === 'function' ? factoryLike : () => factoryLike;
export const createInjector = ({ services }) => {
  const proxy = new Proxy(services, {
    get(target, prop, receiver) {
      if (!Reflect.has(services, prop)) {
        throw new Error(`could not resolve injectable "${prop}"`);
      }
      const factory = factorify(services[prop]);
      return factory(proxy);
    },
  });

  return proxy;
};
