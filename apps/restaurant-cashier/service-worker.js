const nanoid = (t = 21) =>
  crypto
    .getRandomValues(new Uint8Array(t))
    .reduce(
      (t, e) =>
        (t +=
          (e &= 63) < 36
            ? e.toString(36)
            : e < 62
              ? (e - 26).toString(36).toUpperCase()
              : e > 62
                ? '-'
                : '_'),
      '',
    );

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

const currentCart = {
  id: 'some_cart_id',
  items: {},
  total: {
    amountInCents: 0,
    currency: '$',
  },
  createdAt: new Date(Date.now() - 2 * 60 * 1_000),
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
    if (pathname.startsWith('/api/products')) {
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
          event.respondWith(addProduct(event.request));
        }
      } else {
        const matches = pathname.match(/\/api\/products\/(\w+)/);
        if (matches?.length) {
          const [, sku] = matches;
          if (request.method === 'DELETE') {
            event.respondWith(deleteProduct({ sku }));
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
            event.respondWith(updateProduct(event.request));
          }
        }
      }
    }

    if (pathname.startsWith('/api/images')) {
      if (pathname === '/api/images' && request.method === 'POST') {
        event.respondWith(cacheFileToUpload(request));
      } else {
        event.respondWith(cacheFirst(request));
      }
    }

    if (pathname.startsWith('/api/carts')) {
      if (pathname === '/api/carts/current' && request.method === 'GET') {
        event.respondWith(
          new Response(JSON.stringify(currentCart), {
            headers: {
              'Content-Type': 'application/json',
            },
          }),
        );
      }
      if (/\/api\/carts\/(\w+)\/(\w+)/.test(pathname)) {
        event.respondWith(setCartItemQuantity(request));
      }
    }
  }
});

async function updateProduct(request) {
  const _request = await request.clone();
  const product = await _request.json();
  if (!fakeProducts[product.sku]) {
    return new Response(null, {
      status: 404,
    });
  }
  fakeProducts[product.sku] = product;
  return new Response(null, {
    status: 204,
  });
}

async function addProduct(request) {
  const _request = await request.clone();
  const product = await _request.json();
  if (fakeProducts[product.sku]) {
    return new Response(null, {
      status: 409,
    });
  }

  fakeProducts = {
    [product.sku]: product,
    ...fakeProducts,
  };
  return new Response(null, {
    status: 201,
  });
}

async function cacheFirst(request) {
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }
  return fetch(request);
}

async function cacheFileToUpload(request) {
  try {
    const id = nanoid();
    const [_request, cache] = await Promise.all([
      request.clone(),
      caches.open('images'),
    ]);
    const blob = await _request.blob();
    await cache.put(
      new URL(`api/images/${id}`, 'http://localhost:5173').href,
      new Response(blob, {
        status: 200,
        headers: {
          'Content-Type': blob.type,
        },
      }),
    );
    const respBody = JSON.stringify({
      url: new URL(`/api/images/${id}`, 'http://localhost:5173').href,
    });
    return new Response(respBody, {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (e) {
    console.error(e);
    return new Response(null, {
      status: 500,
    });
  }
}

async function deleteProduct({ sku }) {
  const product = fakeProducts[sku];
  if (!product) {
    return new Response(null, { status: 404 });
  }
  if (currentCart.items[product.sku]) {
    return new Response(null, { status: 409 }); // can't remove a product which is currently in a cart
  }

  delete fakeProducts[sku];
  return new Response(null, { status: 204 });
}

// this makes a snapshot of the product at the moment, if product's price changes while the cart is open, the cart won't be affected unless quantity is modified
async function setCartItemQuantity(request) {
  const _request = await request.clone();
  const cartItem = await _request.json();
  const requestURL = new URL(request.url);
  const pathname = requestURL.pathname;
  const matches = pathname.match(/\/api\/carts\/(\w+)\/(\w+)/);
  const [, cartId, sku] = matches;
  if (cartId !== currentCart.id) {
    return new Response(null, {
      status: 409,
    }); // cart is already closed
  }

  if (!fakeProducts[sku]) {
    return new Response(null, {
      status: 404,
    });
  }

  currentCart.items[sku] = cartItem;
  currentCart.items = normalizeCartItems({ items: currentCart.items });
  currentCart.total = {
    amountInCents: getCartTotal(),
    currency: '$',
  };

  return new Response(null, {
    status: 200,
  });
}

const getCartTotal = () =>
  Object.entries(currentCart.items).reduce(
    (total, [sku, { quantity }]) =>
      total + quantity * fakeProducts[sku].price.amountInCents,
    0,
  );

const normalizeCartItems = ({ items }) => {
  return Object.fromEntries(
    Object.entries(items)
      .filter(([, item]) => (item?.quantity ?? 0) > 0)
      .map(([sku, item]) => [sku, item]),
  );
};
