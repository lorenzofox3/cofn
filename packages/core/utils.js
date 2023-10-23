export const getAttributes = (el) =>
  Object.fromEntries(
    el.getAttributeNames().map((name) => [name, el.getAttribute(name)]),
  );
export const once = (fn) => {
  let hasRun = false;
  return (...args) => {
    if (!hasRun) {
      hasRun = true;
      fn(...args);
    }
  };
};
export const zip = (array1, array2) =>
  array1.map((item, index) => [item, array2[index]]);
