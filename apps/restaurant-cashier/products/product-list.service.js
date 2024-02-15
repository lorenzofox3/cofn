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
    async fetch() {
      store.products.items = await http('products');
      dispatch();
    },
    async remove({ sku }) {
      const toRemove = store.products.items[sku];
      delete store.products.items[sku];
      // optimistic update: we do not wait for the result
      dispatch();
      try {
        return await http(`products/${sku}`, {
          method: 'DELETE',
        });
      } catch (err) {
        notificationsService.error({
          message: 'An error occurred. The product could not be deleted.',
        });
        store.products.items[sku] = toRemove;
        dispatch();
      }
    },
    async fetchOne({ sku }) {
      const product = await http(`products/${sku}`, {
        method: 'GET',
      });
      return (store.products.items[product.sku] = product);
    },
    async update({ product }) {
      const oldValue = store.products.items[product.sku];
      store.products.items[product.sku] = product;
      // optimistic update: we do not wait for the result
      dispatch();
      try {
        return await http(`products/${product.sku}`, {
          method: 'PUT',
          body: JSON.stringify(product),
        });
      } catch (err) {
        notificationsService.error({
          message: 'An error occurred. The product could not be updated.',
        });
        store.products.items[product.sku] = oldValue;
        dispatch();
      }
    },
    async create({ product }) {
      store.products.items[product.sku] = product;
      // optimistic update: we do not wait for the result
      dispatch();
      try {
        return await http(`products`, {
          method: 'POST',
          body: JSON.stringify(product),
        });
      } catch (err) {
        notificationsService.error({
          message: 'An error occurred. The product could not be created.',
        });
        delete store.products.items[product.sku];
        dispatch();
      }
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
