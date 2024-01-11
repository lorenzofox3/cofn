import { createEventEmitter } from '../utils/events.service.js';
import { http } from '../utils/http.js';

export const createProductListService = () => {
  const store = {
    products: {},
  };

  const service = createEventEmitter();

  const withDispatch =
    (method) =>
    async (...args) => {
      await method(...args);
      service.emit({
        type: 'product-list-changed',
      });
    };

  return Object.assign(service, {
    fetch: withDispatch(async () => {
      store.products.items = await http('products');
    }),
    remove: withDispatch(async ({ sku }) => {
      const toRemove = store.products.items[sku];
      delete store.products.items[sku];
      // optimistic update: we do not wait for the result
      http(`products/${sku}`, {
        method: 'DELETE',
      }).catch(() => {
        store.products.items[sku] = toRemove;
      });
    }),
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

export const productListService = createProductListService();
