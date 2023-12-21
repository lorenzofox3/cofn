import { test } from '@cofn/test-lib/client';
import { define } from '../src/index.js';
import { nextTick } from './utils.js';

const debug = document.getElementById('debug');
const coroutine = function* ({ $root, $host }) {
  $host.renderCount = 0;
  while (true) {
    const { attributes } = yield;
    $root.textContent = `${attributes['first-attribute']} - ${attributes['second-attribute']}`;
    $host.renderCount += 1;
  }
};
define('static-attributes-component', coroutine);
define('reactive-attributes-component', coroutine, {
  observedAttributes: ['first-attribute', 'second-attribute'],
});

test('attributes are forwarded as data', ({ eq }) => {
  const el = document.createElement('static-attributes-component');
  el.setAttribute('first-attribute', 'hello');
  el.setAttribute('second-attribute', 'world');
  debug.appendChild(el);

  eq(el.textContent, 'hello - world');
  eq(el.renderCount, 1);
});

test('component is not updated when attribute is not declared observed', ({
  eq,
}) => {
  const el = document.createElement('static-attributes-component');
  el.setAttribute('first-attribute', 'hello');
  el.setAttribute('second-attribute', 'world');
  debug.appendChild(el);
  eq(el.textContent, 'hello - world');
  eq(el.renderCount, 1);
  el.setAttribute('first-attribute', 'bonjour');
  eq(el.textContent, 'hello - world');
  eq(el.renderCount, 1);
});

test('component is updated when attribute is declared observed', async ({
  eq,
}) => {
  const el = document.createElement('reactive-attributes-component');
  el.setAttribute('first-attribute', 'hello');
  el.setAttribute('second-attribute', 'world');
  debug.appendChild(el);
  eq(el.textContent, 'hello - world');
  eq(el.renderCount, 1);
  el.setAttribute('first-attribute', 'bonjour');

  await nextTick();

  eq(el.textContent, 'bonjour - world');
  eq(el.renderCount, 2);

  el.setAttribute('first-attribute', 'buenas tardes');
  el.setAttribute('second-attribute', 'lorenzo');

  await nextTick();

  eq(el.textContent, 'buenas tardes - lorenzo');
  eq(
    el.renderCount,
    3,
    'there is only one render when multiple attributes are updated',
  );
});
