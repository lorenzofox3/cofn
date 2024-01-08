export const createProductListController =
  ({ productListService }) =>
  (comp) =>
    function* ({ $signal, $host, ...rest }) {
      const { render } = $host;
      $host.render = (args = {}) => {
        render({
          ...args,
          ...productListService.getState(),
        });
      };

      productListService.on(
        'product-list-changed',
        () => {
          $host.render();
        },
        {
          signal: $signal,
        },
      );

      yield* comp({ $signal, $host, productListService, ...rest });
    };
