export const compose =
  (...fns) =>
  (arg) =>
    fns.reduceRight((x, fn) => fn(x), arg);
