import { createEventEmitter } from '../utils/events.service.js';
import { http } from '../utils/http.js';
import {
  createNotificationsService,
  notificationsService,
} from '../utils/notifications.service.js';

export const createProductListService = ({ notificationsService }) => {
  const store = {
    products: {
      items: {},
    },
  };

  const service = createEventEmitter();

  return Object.assign(service, {
    fetch: async () => {
      store.products.items = await http('products');
      service.emit({
        type: 'product-list-changed',
      });
    },
    remove: async ({ sku }) => {
      const toRemove = store.products.items[sku];
      delete store.products.items[sku];
      // optimistic update: we do not wait for the result
      service.emit({
        type: 'product-list-changed',
      });
      return http(`products/${sku}`, {
        method: 'DELETE',
      }).catch((err) => {
        notificationsService.error({
          message: 'An error occurred. The product could not be deleted.',
        });
        store.products.items[sku] = toRemove;
        service.emit({
          type: 'product-list-changed',
        });
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
      service.emit({
        type: 'product-list-changed',
      });
      return http(`products/${product.sku}`, {
        method: 'PUT',
        body: JSON.stringify(product),
      }).catch((err) => {
        notificationsService.error({
          message: 'An error occurred. The product could not be updated.',
        });
        store.products.items[product.sku] = oldValue;
        service.emit({
          type: 'product-list-changed',
        });
        throw err;
      });
    },
    create: async ({ product }) => {
      store.products.items[product.sku] = product;
      // optimistic update: we do not wait for the result
      service.emit({
        type: 'product-list-changed',
      });
      return http(`products`, {
        method: 'POST',
        body: JSON.stringify(product),
      }).catch((err) => {
        notificationsService.error({
          message: 'An error occurred. The product could not be created.',
        });
        delete store.products.items[product.sku];
        service.emit({
          type: 'product-list-changed',
        });
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
