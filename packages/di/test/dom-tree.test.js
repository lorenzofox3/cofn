import { test } from '@cofn/test-lib/client';
import { define } from '@cofn/core';
import { inject, provide } from '../src/index.js';
import { nextTick } from './utils.js';

const debug = document.getElementById('debug');
const dumb = function* () {};

define('test-dumb-child', dumb);

const greeter = {
  fr: {
    hello({ name }) {
      return `Bonjour ${name}`;
    },
  },
  es: {
    hello({ name }) {
      return `Hola ${name}`;
    },
  },
  en: {
    hello({ name }) {
      return `Hello ${name}`;
    },
  },
};

const provideIntl = provide(({ $host }) => {
  const lang = $host.getAttribute('lang') ?? 'en';
  return {
    intl() {
      return greeter[lang.split('-')[0]] ?? greeter['en'];
    },
  };
});

define(
  'lang-provider',
  provideIntl(function* () {}),
);

define(
  'hello-world',
  inject(function* ({ services, $root, $host }) {
    const { intl } = services;
    try {
      while (true) {
        const input = yield;
        $root.textContent = intl.hello({ name: input?.attributes?.name ?? '' });
      }
    } finally {
      $host.isClean = true;
    }
  }),
);

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

test('data and attributes are passed along', async ({ eq }) => {
  const testedElement = document.createElement('template');
  testedElement.innerHTML = `
      <lang-provider lang="es">
        <hello-world id="es-root" name="lorenzofox"></hello-world>
        <lang-provider lang="fr">
            <hello-world id="fr-override" name="laurent"></hello-world>
        </lang-provider>
    </lang-provider>
    <lang-provider lang="en">
        <hello-world id="en-sibling-1" name="lorenzofox"></hello-world>
        <hello-world id="en-sibling-2" name="bob"></hello-world>
    </lang-provider>
`;
  debug.appendChild(testedElement.content.cloneNode(true));
  await nextTick();
  const esRootEl = document.getElementById('es-root');
  const frOverrideEl = document.getElementById('fr-override');
  const enSibling1El = document.getElementById('en-sibling-1');
  const enSibling2El = document.getElementById('en-sibling-2');
  eq(esRootEl.textContent, 'Hola lorenzofox');
  eq(frOverrideEl.textContent, 'Bonjour laurent');
  eq(enSibling1El.textContent, 'Hello lorenzofox');
  eq(enSibling2El.textContent, 'Hello bob');
});

test('provider gets injected its own registry', async ({ eq }) => {
  let tested = false;
  define(
    'provider-injected',
    provide({
      a: 'hello',
    })(function* ({ services }) {
      eq(services.a, 'hello');
      tested = true;
    }),
  );

  debug.appendChild(document.createElement('provider-injected'));
  await nextTick();
  eq(tested, true);
});
