export const withController = (controllerFn) => (view) =>
  function* (deps) {
    const state = {};
    const { $host } = deps;
    let pendingUpdate = false;

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
            // no need to render if the view is not connected or is already rendering
            if ($host.isConnected && !pendingUpdate) {
              pendingUpdate = true;
              window.queueMicrotask(() => {
                pendingUpdate = false;
                $host.render();
              });
            }
            return true;
          },
        }),
        attributes: getAttributes(deps.$host), // to get initial state if required
      }),
    };

    // inject controller in the view
    const componentInstance = view({
      ...deps,
      controller: ctrl,
    });

    // overwrite render fn
    const _render = $host.render.bind($host);
    $host.render = (args = {}) =>
      _render({
        ...args,
        state: ctrl.getState(),
      });

    // make sure the underlying view can call its cleanup hook when the host is disposed
    deps.$signal.addEventListener('abort', () => componentInstance.return(), {
      once: true,
    });

    yield* componentInstance;
  };

const getAttributes = (el) =>
  Object.fromEntries(
    el.getAttributeNames().map((name) => [name, el.getAttribute(name)]),
  );
