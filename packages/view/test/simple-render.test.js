import { test } from '@cofn/test-lib/client';
import { fromView, nextTick } from './utils.js';

const debug = document.getElementById('debug');
test('renders a component when mounted', async ({ eq }) => {
  const el = fromView(
    ({ html }) =>
      ({ attributes }) =>
        html`<p>hello ${attributes.name}</p>`,
  );

  el.setAttribute('name', 'Laurent');
  debug.appendChild(el);
  await nextTick();
  eq(el.innerHTML, '<p>hello Laurent</p>');
});

test('component is updated when rendered is called, passing the relevant data', async ({
  eq,
}) => {
  const el = fromView(
    ({ html }) =>
      ({ attributes }) =>
        html`<p>hello ${attributes.name}</p>`,
  );
  el.setAttribute('name', 'Laurent');
  debug.appendChild(el);

  await nextTick();

  eq(el.innerHTML, '<p>hello Laurent</p>');

  el.render({
    attributes: { name: 'Robert' },
  });

  await nextTick();

  eq(el.innerHTML, '<p>hello Robert</p>');
});

test('a text node can have multiple active sites', async ({ eq }) => {
  const el = fromView(
    ({ html }) =>
      ({ attributes }) =>
        html`<p>hello ${attributes.firstname} ${attributes.lastname}</p>`,
  );
  el.setAttribute('firstname', 'Laurent');
  el.setAttribute('lastname', 'Renard');
  debug.appendChild(el);

  await nextTick();

  eq(el.innerHTML, '<p>hello Laurent Renard</p>');

  el.render({
    attributes: { firstname: 'Robert', lastname: 'Marley' },
  });

  await nextTick();

  eq(el.innerHTML, '<p>hello Robert Marley</p>');
});

test('renders a document fragment', async ({ eq }) => {
  const el = fromView(
    ({ html }) =>
      ({ attributes }) =>
        // prettier-ignore
        html`<h2>some title</h2><p>hello ${attributes.name}</p>`,
  );

  el.setAttribute('name', 'Laurent');
  debug.appendChild(el);

  await nextTick();

  eq(el.innerHTML, `<h2>some title</h2><p>hello Laurent</p>`);
});

test('renders a nested template', async ({ eq }) => {
  const el = fromView(
    ({ html }) =>
      ({ attributes }) =>
        // prettier-ignore
        html`<h2>some title</h2><p>hello ${attributes.name}</p>${html`<p>you are ${attributes.mood}</p>`}`,
  );

  el.setAttribute('name', 'Laurent');
  el.setAttribute('mood', 'happy');
  debug.appendChild(el);

  await nextTick();

  eq(
    el.innerHTML,
    `<h2>some title</h2><p>hello Laurent</p><!--before--><p>you are happy</p><!--after-->`,
  );

  el.render({
    attributes: {
      name: 'Robert',
      mood: 'very happy',
    },
  });

  await nextTick();

  eq(
    el.innerHTML,
    `<h2>some title</h2><p>hello Robert</p><!--before--><p>you are very happy</p><!--after-->`,
  );
});

test('A template is static if it is not a function of any state', async ({
  eq,
}) => {
  const el = fromView(
    ({ html }) =>
      // prettier-ignore
      html`<h2>some title</h2><p>hello there, how are you?</p>`,
  );

  debug.appendChild(el);

  await nextTick();

  eq(el.innerHTML, `<h2>some title</h2><p>hello there, how are you?</p>`);

  el.render();

  await nextTick();

  eq(el.innerHTML, `<h2>some title</h2><p>hello there, how are you?</p>`);
});
