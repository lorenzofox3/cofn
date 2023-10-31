export const getAttributes = (el) =>
  Object.fromEntries(
    el.getAttributeNames().map((name) => [name, el.getAttribute(name)]),
  );
export const zip = (array1, array2) =>
  array1.map((item, index) => [item, array2[index]]);
