import { cartEvents, cartService } from './cart.service.js';

export const createCartController =
  ({ cartService }) =>
  (comp) =>
    function* ({ $signal, $host, ...rest }) {
      const { render } = $host;
      $host.render = (args = {}) =>
        render({
          ...args,
          ...cartService.getState(),
        });

      cartService.on(cartEvents.CART_CHANGED, () => $host.render(), {
        signal: $signal,
      });

      cartService.fetchCurrent();

      yield* comp({
        $host,
        $signal,
        cartService,
        ...rest,
      });
    };

export const withCartController = createCartController({ cartService });
