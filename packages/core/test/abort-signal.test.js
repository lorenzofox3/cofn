import { define } from '../src/index.js';
import { test } from './_tools/test.js';
import { nextTick } from './utils.js';

const debug = document.getElementById('debug');
define('abort-signal', function* ({ $signal, $host }) {
  $host.hasBeenRemoved = false;

  $signal.addEventListener('abort', () => {
    $host.hasBeenRemoved = true;
  });

  while (true) {
    yield;
    $host.textContent = 'simple component';
  }
});

const withEl = (specFn) =>
  function zora_spec_fn(assert) {
    const el = document.createElement('abort-signal');
    debug.appendChild(el);
    return specFn({ ...assert, el });
  };

test(
  'when removed the abort signal is called',
  withEl(async ({ eq, el }) => {
    eq(el.hasBeenRemoved, false);

    el.remove();

    await nextTick();

    eq(el.hasBeenRemoved, true);
  }),
);

test(
  'when moved around, the abort signal is not called',
  withEl(async ({ eq, el }) => {
    eq(el.hasBeenRemoved, false);
    debug.prepend(el);

    await nextTick();

    eq(el.hasBeenRemoved, false);
  }),
);
