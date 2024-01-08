export const mapValues = (mapFn) => (obj) =>
  Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      return [key, mapFn(value)];
    }),
  );
