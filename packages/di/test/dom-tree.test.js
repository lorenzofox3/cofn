import { test } from '@cofn/test-lib/client';
import { define } from '@cofn/core';
import { inject, provide } from '../src/index.js';
import { nextTick } from './utils.js';

const debug = document.getElementById('debug');
const dumb = function* () {};

define('test-dumb-child', dumb);

test('DOM element that registers some injectables has "provider" attribute', async ({
  eq,
}) => {
  define(
    'test-provider',
    provide({
      a: 'a',
    })(dumb),
  );

  const root = document.createElement('test-provider');
  root.append(document.createElement('test-dumb-child'));

  debug.append(root);

  await nextTick();

  eq(root.hasAttribute('provider'), true);
});
test('"inject" injects services which were registered by a parent "provider element" ', async ({
  eq,
}) => {
  define(
    'test-provider-1',
    provide({
      a: 'a',
      b: 'b',
    })(dumb),
  );
  define(
    'test-consumer',
    inject(function* ({ $host, services }) {
      $host.a = services.a;
      $host.b = services.b;
    }),
  );

  const root = document.createElement('test-provider-1');
  const anyChild = document.createElement('test-dumb-child');
  const injected = document.createElement('test-consumer');

  anyChild.appendChild(injected);
  root.append(anyChild);
  debug.append(root);

  await nextTick();

  eq(injected.a, 'a');
  eq(injected.b, 'b');
});

test('provider can be a function which has the $host as a parameter', async ({
  eq,
}) => {
  define(
    'test-provider-fn',
    provide(({ $host }) => {
      return {
        injected: $host.getAttribute('woot'),
      };
    })(dumb),
  );
  define(
    'test-consumer-fn',
    inject(function* ({ $host, services }) {
      $host.injected = services.injected;
    }),
  );

  const root = document.createElement('test-provider-fn');
  root.setAttribute('woot', 'bar');
  const anyChild = document.createElement('test-dumb-child');
  const injected = document.createElement('test-consumer-fn');

  anyChild.appendChild(injected);
  root.append(anyChild);
  debug.append(root);

  await nextTick();

  eq(injected.injected, 'bar');
});

test(`provider element shadows parent's injectables`, async ({ eq }) => {
  define(
    'test-provider-root',
    provide({
      a: 'a',
      b: 'b',
    })(dumb),
  );
  define(
    'test-provider-child',
    provide({
      a: 'abis',
    })(dumb),
  );

  define(
    'test-consumer-shadowed',
    inject(function* ({ $host, services }) {
      $host.a = services.a;
      $host.b = services.b;
    }),
  );

  const root = document.createElement('test-provider-root');
  const anyChild = document.createElement('test-provider-child');
  const injected = document.createElement('test-consumer-shadowed');

  anyChild.appendChild(injected);
  root.append(anyChild);
  debug.append(root);

  await nextTick();

  eq(injected.a, 'abis');
  eq(injected.b, 'b');
});
