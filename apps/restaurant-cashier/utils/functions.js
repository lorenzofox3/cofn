export const compose = (fns) => (args) =>
  fns.reduceRight((y, fn) => fn(y), args);

export const identity = (x) => x;

export const wait = (time) =>
  new Promise((resolve) => setTimeout(resolve, time));

export const curry2 = (fn) => (a, b) => {
  if (b === undefined) {
    return (b) => fn(a, b);
  }
  return fn(a, b);
};
