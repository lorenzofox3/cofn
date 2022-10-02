export const withInjectables =
  (injectables = {}) =>
  (gen) =>
    function* (args = {}) {
      return yield* gen({
        ...injectables,
        ...args,
      });
    };
