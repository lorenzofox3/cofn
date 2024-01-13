import { curry2 } from './functions.js';
export const mapBind = curry2(
  (mapFn, target) =>
    new Proxy(target, {
      get(target, prop) {
        return mapFn(Reflect.get(target, prop).bind(target));
      },
    }),
);

export const mapValues = curry2((mapFn, target) =>
  Object.fromEntries(
    Object.entries(target).map(([key, value]) => [key, mapFn(value)]),
  ),
);
