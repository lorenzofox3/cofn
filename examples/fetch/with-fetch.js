export const withFetch =
  ({ fetch }) =>
  (gen) =>
    function* (args = {}) {
      const { $el } = args;
      const resource = {
        fetch(path) {
          // wrap in a setTimeout, so we make sure we don't block a generator
          setTimeout(async () => {
            $el.render({
              resources: {
                [path]: {
                  state: 'loading',
                },
              },
            });

            // todo follow actual fetch API (.json() etc)
            try {
              const data = await fetch(path);
              $el.render({
                resources: {
                  [path]: {
                    state: 'loaded',
                    data,
                  },
                },
              });
            } catch (err) {
              $el.render({
                resources: {
                  [path]: {
                    state: 'errored',
                    err,
                  },
                },
              });
            }
          });
        },
      };
      yield* gen({ ...args, resource });
    };
