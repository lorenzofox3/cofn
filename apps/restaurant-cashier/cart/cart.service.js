import { createEventEmitter } from '../utils/events.service.js';
import { http } from '../utils/http.js';
import { notificationsService } from '../utils/notifications.service.js';
import {
  productListEvents,
  productListService,
} from '../products/product-list.service.js';

export const cartEvents = {
  CART_CHANGED: 'cart-changed',
};
export const createCartService = ({
  notificationsService,
  productListService,
}) => {
  const store = {
    currentCart: {
      id: 'test',
      items: {},
      createdAt: new Date(),
      total: {
        amountInCents: 0,
        currency: '$',
      },
    },
    products: {},
  };

  const service = createEventEmitter();

  productListService.on(productListEvents.PRODUCT_LIST_CHANGED, () => {
    store.products = productListService.getState().products.reduce(
      (registry, product) => ({
        ...registry,
        [product.sku]: product,
      }),
      {},
    );
  });

  return Object.assign(service, {
    async fetchCurrent() {
      store.currentCart = await http('carts/current');
      await productListService.fetch();
      service.emit({
        type: 'cart-changed',
      });
    },
    async setItemQuantity({ sku, quantity = 1 }) {
      const currentItem = store.currentCart.items[sku];

      if (quantity === 0) {
        delete store.currentCart.items[sku];
      } else {
        store.currentCart.items[sku] = {
          quantity,
        };
      }

      service.emit(cartEvents.CART_CHANGED);

      try {
        await http(`carts/${store.currentCart.id}/${sku}`, {
          method: 'PUT',
          body: JSON.stringify({
            quantity,
          }),
        });
        await service.fetchCurrent();
      } catch (err) {
        notificationsService.error({
          message: 'An error occurred. Cart Item could not be changed',
        });
        if (currentItem === undefined) {
          delete store.currentCart.items[sku];
        } else {
          store.currentCart.items[sku] = currentItem;
        }

        service.emit({
          type: cartEvents.CART_CHANGED,
        });
        throw err;
      }
    },
    getState() {
      return structuredClone(store);
    },
  });
};

export const cartService = createCartService({
  notificationsService,
  productListService,
});
