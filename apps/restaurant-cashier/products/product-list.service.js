import { createEventEmitter } from '../utils/events.js';
import { http } from '../http.js';

const fakeList = {
  BIGMC: {
    title: `Big Mac long string don't know what to do`,
    description: `A slice of beef between two buns but with a long description which wraps anyways`,
    price: {
      amountInCents: 8.99,
      currency: '$',
    },
  },
  MCFLRY: {
    title: `Mac Flurry ice cream`,
    description: `An yummy icecream with a topping. The whole thing is full of sugar`,
    price: {
      amountInCents: 2.59,
      currency: '$',
    },
  },
  MCCHI: {
    title: `Mac Chicken`,
    description: `A burger made of a nice piece of chicken`,
    price: {
      amountInCents: 6.99,
      currency: '$',
    },
  },
};

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
