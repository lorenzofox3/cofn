import { test } from '@cofn/test-lib/client';
import { fromView } from './utils.js';

const debug = document.getElementById('debug');

test('elements can be added or removed with conditional expression', ({
  eq,
}) => {
  const el = fromView(
    ({ html }) =>
      ({ showItem }) =>
        // prettier-ignore
        html`<ul><li>item1</li>${showItem === true ? html`<li>item2</li>` : null}<li>item3</li></ul>`,
  );

  debug.appendChild(el);
  eq(
    el.innerHTML,
    `<ul><li>item1</li><!--before--><!--after--><li>item3</li></ul>`,
  );
  el.render({ showItem: true });
  eq(
    el.innerHTML,
    `<ul><li>item1</li><!--before--><li>item2</li><!--after--><li>item3</li></ul>`,
  );
  el.render({ showItem: false });
  eq(
    el.innerHTML,
    `<ul><li>item1</li><!--before--><!--after--><li>item3</li></ul>`,
  );
});

test('elements can be swapped depending on a condition', ({ eq }) => {
  const el = fromView(
    ({ html }) =>
      ({ showItem }) =>
        // prettier-ignore
        html`<ul><li>item1</li>${showItem === true ? html`<li>item2</li>` : html`<li>item2bis</li>`}<li>item3</li></ul>`,
  );

  debug.appendChild(el);
  eq(
    el.innerHTML,
    `<ul><li>item1</li><!--before--><li>item2bis</li><!--after--><li>item3</li></ul>`,
  );
  el.render({ showItem: true });
  eq(
    el.innerHTML,
    `<ul><li>item1</li><!--before--><li>item2</li><!--after--><li>item3</li></ul>`,
  );
  el.render({ showItem: false });
  eq(
    el.innerHTML,
    `<ul><li>item1</li><!--before--><li>item2bis</li><!--after--><li>item3</li></ul>`,
  );
});
