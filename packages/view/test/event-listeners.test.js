import { test } from '@cofn/test-lib/client';
import { fromView, nextTick } from './utils.js';

const debug = document.getElementById('debug');
test('attribute starting with a @ is an event listener', ({ eq }) => {
  let count = 0;

  const listener = () => (count += 1);

  const el = fromView(
    ({ html }) =>
      () =>
        html`<button @click="${listener}">click</button>`,
  );

  debug.appendChild(el);
  eq(count, 0);

  el.firstElementChild.click();

  eq(count, 1);
});

test('when updated, legacy listener is removed while new listener is attached', ({
  eq,
}) => {
  let count = 0;

  const listener1 = () => (count += 1);
  const listener2 = () => (count += 2);

  const el = fromView(
    ({ html }) =>
      ({ onclick = listener1 }) =>
        html`<button @click="${onclick}">click</button>`,
  );

  debug.appendChild(el);
  eq(count, 0);

  const button = el.firstElementChild;

  button.click();

  eq(count, 1);

  el.render({
    onclick: listener2,
  });

  button.click();

  eq(count, 3);
});

test('when element is removed all listeners are removed', async ({ eq }) => {
  let count = 0;
  const listener = () => {
    count += 1;
  };

  const el = fromView(({ html, $signal }) => {
    return () => html`<button @click="${listener}">click</button>`;
  });

  debug.appendChild(el);
  eq(count, 0);

  const button = el.firstElementChild;
  button.click();

  eq(count, 1);

  el.remove();

  await nextTick();

  button.click();

  eq(count, 1);
});
