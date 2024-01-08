export const compose = (fns) => (args) =>
  fns.reduceRight((y, fn) => fn(y), args);
