export const compose = (fns) => (arg) => fns.reduceRight((y, fn) => fn(y), arg);
export const not = (fn) => (arg) => !fn(arg);
export const mapValues = (mapFn) => (obj) =>
  Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, mapFn(value)]),
  );
