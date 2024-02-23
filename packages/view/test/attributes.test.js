import { test } from '@cofn/test-lib/client';
import { fromView, nextTick } from './utils.js';

const debug = document.getElementById('debug');

test('attribute can be interpolated', async ({ eq }) => {
  const el = fromView(
    ({ html }) =>
      ({ attributes }) =>
        html`<p data-id="${attributes['item-id']}">hello</p>`,
  );
  el.setAttribute('item-id', 'someId');
  debug.appendChild(el);
  await nextTick();
  eq(el.querySelector('p').getAttribute('data-id'), 'someId');
  el.render({
    attributes: {
      ['item-id']: 'otherId',
    },
  });
  await nextTick();

  eq(el.querySelector('p').getAttribute('data-id'), 'otherId');
});

test('attribute is set when value type is boolean and value is "true", attribute is removed when value is "false"', async ({
  eq,
}) => {
  const el = fromView(
    ({ html }) =>
      ({ data } = {}) =>
        html`<p open="${data?.open}">hello</p>`,
  );
  debug.appendChild(el);

  await nextTick();

  const pEl = el.querySelector('p');
  el.render({
    data: {
      open: true,
    },
  });
  await nextTick();

  eq(pEl.getAttribute('open'), 'true');
  eq(pEl.hasAttribute('open'), true);
  el.render({
    data: {
      open: false,
    },
  });
  await nextTick();

  eq(pEl.hasAttribute('open'), false);
});

test('attribute starting with "." sets a property', async ({ eq }) => {
  const el = fromView(
    ({ html }) =>
      ({ value }) =>
        html`<input .value="${value}" type="text" />`,
  );

  debug.appendChild(el);
  await nextTick();
  const input = el.firstElementChild;
  eq(input.value, '');
  el.render({ value: 'hello' });
  await nextTick();
  eq(input.value, 'hello');
  el.render({ value: 'hello world' });
  await nextTick();
  eq(input.value, 'hello world');
});
