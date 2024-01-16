let fakeProducts = {
  bigmc: {
    sku: 'bigmc',
    title: `Big Mac long string don't know what to do`,
    description: `A slice of beef between two buns but with a long description which wraps anyways`,
    price: {
      amountInCents: 899,
      currency: '$',
    },
  },
  mcflry: {
    sku: 'mcflry',
    title: `Mac Flurry ice cream`,
    description: `An yummy icecream with a topping. The whole thing is full of sugar`,
    price: {
      amountInCents: 259,
      currency: '$',
    },
  },
  mcchi: {
    sku: 'mcchi',
    title: `Mac Chicken`,
    description: `A burger made of a nice piece of chicken`,
    price: {
      amountInCents: 699,
      currency: '$',
    },
  },
  adkl: {
    sku: 'adkl',
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
  const pathname = requestURL.pathname;
  if (pathname.startsWith('/api')) {
    if (pathname === '/api/products') {
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
                if (fakeProducts[product.sku]) {
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
    } else {
      const matches = pathname.match(/\/api\/products\/(\w+)/);
      if (matches?.length) {
        const [, sku] = matches;
        const product = fakeProducts[sku];
        if (request.method === 'DELETE') {
          if (product) {
            delete fakeProducts[sku];
            event.respondWith(new Response(null, { status: 204 }));
          } else {
            event.respondWith(new Response(null, { status: 404 }));
          }
        } else if (request.method === 'GET') {
          event.respondWith(
            new Response(product ? JSON.stringify(product) : null, {
              headers: {
                'Content-Type': 'application/json',
              },
              status: product ? 200 : 404,
            }),
          );
        } else if (request.method === 'PUT') {
          event.respondWith(
            new Promise((resolve) => {
              event.request
                .clone()
                .json()
                .then((product) => {
                  if (fakeProducts[product.sku]) {
                    fakeProducts[product.sku] = product;
                    resolve(
                      new Response(null, {
                        status: 204,
                      }),
                    );
                  } else {
                    resolve(
                      new Response(null, {
                        status: 404,
                      }),
                    );
                  }
                });
            }),
          );
        }
      }
    }
  }
});
