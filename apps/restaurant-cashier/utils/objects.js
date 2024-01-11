const _mapBind = (mapFn, target) =>
  new Proxy(target, {
    get(target, prop) {
      return mapFn(Reflect.get(target, prop).bind(target));
    },
  });
export const mapBind = (mapFn, target) => {
  if (target === undefined) {
    return (target) => _mapBind(mapFn, target);
  }

  return _mapBind(mapFn, target);
};
