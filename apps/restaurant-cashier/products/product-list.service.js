import { createEventEmitter } from '../utils/events.js';
import { http } from '../http.js';

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
