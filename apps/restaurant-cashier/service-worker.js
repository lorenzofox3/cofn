let fakeProducts = {
  BIGMC: {
    title: `Big Mac long string don't know what to do`,
    description: `A slice of beef between two buns but with a long description which wraps anyways`,
    price: {
      amountInCents: 899,
      currency: '$',
    },
  },
  MCFLRY: {
    title: `Mac Flurry ice cream`,
    description: `An yummy icecream with a topping. The whole thing is full of sugar`,
    price: {
      amountInCents: 259,
      currency: '$',
    },
  },
  MCCHI: {
    title: `Mac Chicken`,
    description: `A burger made of a nice piece of chicken`,
    price: {
      amountInCents: 699,
      currency: '$',
    },
  },
  ADKL: {
    title: `Mac Chicken`,
    description: `A burger made of a nice piece of chicken`,
    price: {
      amountInCents: 699,
      currency: '$',
    },
  },
  ASL: {
    title: `Mac Chicken`,
    description: `A burger made of a nice piece of chicken`,
    price: {
      amountInCents: 699,
      currency: '$',
    },
  },
  ALK: {
    title: `Mac Chicken`,
    description: `A burger made of a nice piece of chicken`,
    price: {
      amountInCents: 699,
      currency: '$',
    },
  },
  WOR: {
    title: `Mac Chicken`,
    description: `A burger made of a nice piece of chicken`,
    price: {
      amountInCents: 699,
      currency: '$',
    },
  },
  IEO: {
    title: `Mac Chicken`,
    description: `A burger made of a nice piece of chicken`,
    price: {
      amountInCents: 699,
      currency: '$',
    },
  },
};

self.addEventListener('activate', (event) => {
  // todo while developping
  self.skipWaiting();
  event.waitUntil(clients.claim());
});
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const requestURL = new URL(request.url);
  if (requestURL.pathname === '/api/products') {
    if (request.method === 'GET') {
      event.respondWith(
        new Response(JSON.stringify(fakeProducts), {
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      );
    } else if (request.method === 'POST') {
      event.respondWith(
        new Promise((resolve) => {
          event.request
            .clone()
            .json()
            .then((product) => {
              if (
                fakeProducts[product.sku] ||
                fakeProducts[product.sku.toUpperCase()]
              ) {
                resolve(
                  new Response(null, {
                    status: 409,
                  }),
                );
              } else {
                fakeProducts = {
                  [product.sku]: product,
                  ...fakeProducts,
                };
                resolve(
                  new Response(null, {
                    status: 201,
                  }),
                );
              }
            });
        }),
      );
    }
  }

  if (request.method === 'DELETE') {
    const matches = requestURL.pathname.match(/\/api\/products\/(\w+)/);
    if (matches.length) {
      const [, sku] = matches;
      const uppercaseSku = sku.toUpperCase();
      if (fakeProducts[uppercaseSku]) {
        delete fakeProducts[uppercaseSku];
        event.respondWith(new Response(null, { status: 204 }));
      } else if (fakeProducts[sku]) {
        delete fakeProducts[sku];
        event.respondWith(new Response(null, { status: 204 }));
      } else {
        event.respondWith(new Response(null, { status: 404 }));
      }
    }
  }
});
