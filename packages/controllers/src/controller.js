export const withController = (controllerFn) => (view) =>
  function* (deps) {
    const state = deps.state || {};
    const { $host } = deps;

    const ctrl = {
      getState() {
        return structuredClone(state);
      },
      ...controllerFn({
        ...deps,
        // inject a proxy on state so whenever a setter is called the view gets updated
        state: new Proxy(state, {
          set(obj, prop, value) {
            obj[prop] = value;
            // no need to render if the view is not connected
            if ($host.isConnected) {
              $host.render();
            }
            return true;
          },
        }),
      }),
    };

    // overwrite render fn
    const { render } = $host;
    $host.render = (args = {}) =>
      render({
        ...args,
        state: ctrl.getState(),
      });

    // inject controller in the view
    yield* view({
      ...deps,
      controller: ctrl,
    });
  };
