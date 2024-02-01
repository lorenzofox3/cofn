import { createEventEmitter } from '../utils/events.service.js';
import { http } from '../utils/http.js';
import { notificationsService } from '../utils/notifications.service.js';

export const productListEvents = {
  PRODUCT_LIST_CHANGED: 'product-list-changed',
};

export const createProductListService = ({ notificationsService }) => {
  const store = {
    products: {
      items: {},
    },
  };
  const service = createEventEmitter();
  const dispatch = () =>
    service.emit({
      type: productListEvents.PRODUCT_LIST_CHANGED,
    });

  return Object.assign(service, {
    fetch: async () => {
      store.products.items = await http('products');
      dispatch();
    },
    remove: async ({ sku }) => {
      const toRemove = store.products.items[sku];
      delete store.products.items[sku];
      // optimistic update: we do not wait for the result
      dispatch();
      return http(`products/${sku}`, {
        method: 'DELETE',
      }).catch((err) => {
        notificationsService.error({
          message: 'An error occurred. The product could not be deleted.',
        });
        store.products.items[sku] = toRemove;
        dispatch();
        throw err;
      });
    },
    fetchOne: async ({ sku }) => {
      // todo we could get it from cache first ??
      return http(`products/${sku}`, {
        method: 'GET',
      }).then((product) => {
        return (store.products.items[product.sku] = product);
      });
    },
    update: async ({ product }) => {
      const oldValue = store.products.items[product.sku];
      store.products.items[product.sku] = product;
      // optimistic update: we do not wait for the result
      dispatch();
      return http(`products/${product.sku}`, {
        method: 'PUT',
        body: JSON.stringify(product),
      }).catch((err) => {
        notificationsService.error({
          message: 'An error occurred. The product could not be updated.',
        });
        store.products.items[product.sku] = oldValue;
        dispatch();
        throw err;
      });
    },
    create: async ({ product }) => {
      store.products.items[product.sku] = product;
      // optimistic update: we do not wait for the result
      dispatch();
      return http(`products`, {
        method: 'POST',
        body: JSON.stringify(product),
      }).catch((err) => {
        notificationsService.error({
          message: 'An error occurred. The product could not be created.',
        });
        delete store.products.items[product.sku];
        dispatch();
        throw err;
      });
    },
    getState() {
      return structuredClone({
        products: Object.entries(store.products.items ?? {}).map(
          ([sku, product]) => ({
            sku,
            ...product,
          }),
        ),
      });
    },
  });
};

export const productListService = createProductListService({
  notificationsService,
});
