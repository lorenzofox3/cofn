export const withProps = (props) => (gen) =>
  function* ({ $host, ...rest }) {
    const properties = {} || rest.properties;
    const { render } = $host;

    $host.render = (update = {}) =>
      render({
        properties: {
          ...properties,
        },
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
                $host.render();
              },
            },
          ];
        }),
      ),
    );

    yield* gen({ $host, ...rest });
  };
