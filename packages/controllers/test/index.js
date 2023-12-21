import { test } from '@cofn/test-lib/client';
import { withController } from '../src/index.js';
import { define } from '@cofn/core';
import { nextTick } from './utils.js';

const debug = document.getElementById('debug');
const withCounter = (specFn) =>
  async function zora_spec_fn(assert) {
    const withCounterController = withController(({ state }) => {
      state.count = 42;
      return {
        increment() {
          state.count = state.count + 1;
        },
      };
    });

    define(
      'test-counting-controller',
      withCounterController(function* ({ $host, controller }) {
        $host.addEventListener('click', controller.increment);
        $host.loopCount = 0;

        while (true) {
          const { state } = yield;
          $host.textContent = 'state:' + state.count;
          $host.loopCount += 1;
        }
      }),
    );

    const el = document.createElement('test-counting-controller');
    debug.appendChild(el);
    return await specFn({ ...assert, el });
  };

test('controller function get passed the routine dependencies along with the state', ({
  eq,
  ok,
}) => {
  let hasBeenChecked = false;
  const withSimpleController = withController((deps) => {
    ok(deps.$signal);
    ok(deps.$host);
    ok(deps.$root);
    ok(deps.state);
    hasBeenChecked = true;
    return {};
  });

  define(
    'simple-controller',
    withSimpleController(function* ({ $host }) {
      while (true) {
        yield;
      }
    }),
  );

  const el = document.createElement('simple-controller');

  debug.appendChild(el);

  eq(hasBeenChecked, true);
});

test(
  'component is rendered with the initial state set by the controller',
  withCounter(({ eq, el }) => {
    eq(el.textContent, 'state:42');
    eq(el.loopCount, 1);
  }),
);

test(
  'when state is updated by the controller, the component is rendered',
  withCounter(async ({ eq, el }) => {
    eq(el.textContent, 'state:42');
    el.click();
    await nextTick();
    eq(el.textContent, 'state:43');
    el.click();
    await nextTick();
    eq(el.textContent, 'state:44');
    eq(el.loopCount, 3);
  }),
);

test(
  'updates are batched together',
  withCounter(async ({ el, eq }) => {
    eq(el.textContent, 'state:42');
    eq(el.loopCount, 1);
    el.click();
    el.click();
    el.click();
    eq(el.textContent, 'state:42');
    await nextTick();
    eq(el.textContent, 'state:45');
    eq(el.loopCount, 2);
  }),
);
