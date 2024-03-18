import { test } from '@cofn/test-lib/client';
import { withProps } from '../src/index.js';
import { define } from '@cofn/core';
import { nextTick } from './utils.js';

const debug = document.getElementById('debug');
const withTestProps = withProps(['test', 'other']);

define(
  'test-props-controller',
  withTestProps(function* ({ $host }) {
    let loopCount = 0;
    Object.defineProperty($host, 'count', {
      get() {
        return loopCount;
      },
    });
    try {
      while (true) {
        const { properties } = yield;
        loopCount += 1;
        $host.textContent = JSON.stringify(properties);
      }
    } finally {
      $host.teardown = true;
    }
  }),
);

const withEl = (specFn) =>
  async function zora_spec_fn(assert) {
    const el = document.createElement('test-props-controller');
    debug.appendChild(el);
    try {
      await specFn({ ...assert, el });
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

test(
  'component is rendered with initial set properties',
  withEl(async ({ eq }) => {
    const el = document.createElement('test-props-controller');
    el.test = 'foo';
    await nextTick();
    eq(el.textContent, JSON.stringify({ test: 'foo' }));
  }),
);

test(
  'component is updated when a property is set',
  withEl(async ({ eq, el }) => {
    el.test = 'foo';
    el.other = 'blah';
    await nextTick();
    eq(el.textContent, JSON.stringify({ test: 'foo', other: 'blah' }));
    el.test = 42;
    await nextTick();
    eq(el.textContent, JSON.stringify({ test: 42, other: 'blah' }));
  }),
);

test(
  'component is updated when a property is set',
  withEl(async ({ eq, el }) => {
    el.test = 'foo';
    el.other = 'blah';
    await nextTick();
    eq(el.count, 1);
    eq(el.textContent, JSON.stringify({ test: 'foo', other: 'blah' }));
    el.test = 42;
    await nextTick();
    eq(el.count, 2);
    eq(el.textContent, JSON.stringify({ test: 42, other: 'blah' }));
  }),
);

test(
  'component is updated once when several properties are set',
  withEl(async ({ eq, el }) => {
    el.test = 'foo';
    el.other = 'blah';
    await nextTick();
    eq(el.count, 1);
    eq(el.textContent, JSON.stringify({ test: 'foo', other: 'blah' }));
    el.test = 42;
    el.other = 'updated';
    await nextTick();
    eq(el.count, 2);
    eq(el.textContent, JSON.stringify({ test: 42, other: 'updated' }));
  }),
);

test(
  'component is not updated when a property is set but the property is not in the reactive property list',
  withEl(async ({ eq, el }) => {
    el.test = 'foo';
    el.other = 'blah';
    await nextTick();
    eq(el.count, 1);
    eq(el.textContent, JSON.stringify({ test: 'foo', other: 'blah' }));
    el.whatever = 42;
    await nextTick();
    eq(el.count, 1);
    eq(el.textContent, JSON.stringify({ test: 'foo', other: 'blah' }));
  }),
);

test(
  'tears down of the component is called',
  withEl(async ({ ok, notOk, el }) => {
    notOk(el.teardown);
    el.remove();
    await nextTick();
    ok(el.teardown);
  }),
);
