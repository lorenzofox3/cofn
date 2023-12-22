import { test } from '@cofn/test-lib/client';
import { fromView } from './utils.js';

const debug = document.getElementById('debug');

test('render a component when mounted', ({ eq }) => {
  const el = fromView(
    ({ html }) =>
      ({ attributes }) =>
        html`<p>hello ${attributes.name}</p>`,
  );

  el.setAttribute('name', 'Laurent');
  debug.appendChild(el);
  eq(el.innerHTML, '<p>hello Laurent</p>');
});

test('component is updated when rendered is called, passing the relevant data', ({
  eq,
}) => {
  const el = fromView(
    ({ html }) =>
      ({ attributes }) =>
        html`<p>hello ${attributes.name}</p>`,
  );
  el.setAttribute('name', 'Laurent');
  debug.appendChild(el);

  eq(el.innerHTML, '<p>hello Laurent</p>');

  el.render({
    attributes: { name: 'Robert' },
  });

  eq(el.innerHTML, '<p>hello Robert</p>');
});
