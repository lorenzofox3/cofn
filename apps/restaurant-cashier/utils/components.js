// todo draw that somewhere else (a prop utils ? or part of the framework)
import { mapValues } from './objects.js';

export const reactiveProps = (props) => (comp) =>
  function* ({ $host, ...rest }) {
    let pendingUpdate = false;
    const properties = {};
    const { render } = $host;

    $host.render = (update = {}) =>
      render({
        ...properties,
        ...update,
      });

    Object.defineProperties(
      $host,
      Object.fromEntries(
        props.map((propName) => {
          properties[propName] = $host[propName];
          return [
            propName,
            {
              enumerable: true,
              get() {
                return properties[propName];
              },
              set(value) {
                properties[propName] = value;
                pendingUpdate = true;
                window.queueMicrotask(() => {
                  pendingUpdate = false;
                  $host.render();
                });
              },
            },
          ];
        }),
      ),
    );

    yield* comp({ $host, ...rest });
  };
