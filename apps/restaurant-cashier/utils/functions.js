export const compose = (fns) => (args) =>
  fns.reduceRight((y, fn) => fn(y), args);

export const identity = (x) => x;

export const wait = (time) =>
  new Promise((resolve) => setTimeout(resolve, time));
