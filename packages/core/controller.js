import { getAttributes } from './utils.js';

// where component are infinite loops !
export const withController = (controllerFn) => (view) =>
  function* (deps) {
    const state = {};
    let connected = false;
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
            if (connected && !pendingUpdate) {
              pendingUpdate = true;
              window.queueMicrotask(() => {
                pendingUpdate = false;
                render();
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

    const render = () =>
      componentInstance.next({
        state: ctrl.getState(),
      });

    // make sure the underlying view can call its cleanup hook when the host is disposed
    deps.$signal.addEventListener('abort', () => componentInstance.return(), {
      once: true,
    });

    // enter the rendering loop
    componentInstance.next();
    connected = true;

    // initial render of the view
    render();
  };
