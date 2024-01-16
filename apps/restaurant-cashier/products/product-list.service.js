import { createEventEmitter } from '../utils/events.service.js';
import { http } from '../utils/http.js';

export const createProductListService = () => {
  const store = {
    products: {
      items: {},
    },
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
      return http(`products/${sku}`, {
        method: 'DELETE',
      }).catch((err) => {
        store.products.items[sku] = toRemove;
        throw err;
      });
    }),
    fetchOne: async ({ sku }) => {
      // todo we could get it from cache first ??
      return http(`products/${sku}`, {
        method: 'GET',
      }).then((product) => {
        return (store.products.items[product.sku] = product);
      });
    },
    update: withDispatch(async ({ product }) => {
      const oldValue = store.products.items[product.sku];
      store.products.items[product.sku] = product;
      // optimistic update: we do not wait for the result
      return http(`products/${product.sku}`, {
        method: 'PUT',
        body: JSON.stringify(product),
      }).catch((err) => {
        store.products.items[product.sku] = oldValue;
        throw err;
      });
    }),
    create: withDispatch(async ({ product }) => {
      store.products.items[product.sku] = product;
      // optimistic update: we do not wait for the result
      return http(`products`, {
        method: 'POST',
        body: JSON.stringify(product),
      }).catch((err) => {
        delete store.products.items[product.sku];
        throw err;
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
