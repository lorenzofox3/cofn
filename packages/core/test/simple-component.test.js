import { define } from '../src/index.js';
import { test } from '@cofn/test-lib/client';
import { nextTick } from './utils.js';

const debug = document.getElementById('debug');
define('simple-component', function* ({ $root, $host }) {
  $host.hasBeenRemoved = false;

  try {
    while (true) {
      const { content = 'simple component' } = yield;
      $root.textContent = content;
    }
  } finally {
    $host.hasBeenRemoved = true;
  }
});

const withEl = (specFn) =>
  async function zora_spec_fn(assert) {
    const el = document.createElement('simple-component');
    debug.appendChild(el);
    return await specFn({ ...assert, el });
  };
test(
  'define a simple component from a coroutine',
  withEl(async ({ eq, el }) => {
    await nextTick();
    eq(el.textContent, 'simple component');
  }),
);

test(
  'content passed to render is injected to the coroutine',
  withEl(async ({ eq, el }) => {
    await nextTick();
    eq(el.textContent, 'simple component');
    el.render({ content: 'foo' });
    await nextTick();
    eq(el.textContent, 'foo');
    el.render({ content: 'another foo' });
    await nextTick();
    eq(el.textContent, 'another foo');
  }),
);

test(
  'when removed the finally flow is invoked',
  withEl(async ({ eq, el }) => {
    await nextTick();
    eq(el.hasBeenRemoved, false);
    el.remove();
    await nextTick();
    eq(el.hasBeenRemoved, true);
  }),
);

test(
  'when moved around, the finally flow is not invoked',
  withEl(async ({ eq, el }) => {
    await nextTick();
    eq(el.hasBeenRemoved, false);
    debug.prepend(el);
    await nextTick();
    eq(el.hasBeenRemoved, false);
  }),
);
