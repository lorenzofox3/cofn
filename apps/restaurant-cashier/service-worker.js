const APIRootURL = 'http://localhost:5173/api/';

const fakeProducts = {
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

self.addEventListener('activate', (event) => {
  // todo while developping
  self.skipWaiting();
  event.waitUntil(clients.claim());
});
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const test = new URL('products', APIRootURL).toString();
  if (request.method === 'GET' && request.url === test) {
    event.respondWith(
      new Response(JSON.stringify(fakeProducts), {
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    );
  }
});
