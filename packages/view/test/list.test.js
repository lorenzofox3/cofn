import { test } from '@cofn/test-lib/client';
import { fromView, nextTick } from './utils.js';

const debug = document.getElementById('debug');

test('list is rendered and item within the list is updated', ({ eq }) => {
  const el = fromView(
    ({ html }) =>
      ({ items = [] }) =>
        // prettier-ignore
        html`<ul>${items.map(({ content, id }) => html`${id}::<li>${content}</li>`)}</ul>`,
  );

  debug.appendChild(el);
  eq(el.innerHTML, '<ul><!--before--><!--after--></ul>');
  el.render({
    items: [
      { id: 1, content: 'item1' },
      { id: 2, content: 'item2' },
      { id: 3, content: 'item3' },
    ],
  });

  eq(
    el.innerHTML,
    '<ul><!--before--><li>item1</li><li>item2</li><li>item3</li><!--after--></ul>',
  );

  el.render({
    items: [
      { id: 1, content: 'item1' },
      { id: 2, content: 'item2bis' },
      { id: 3, content: 'item3' },
    ],
  });

  eq(
    el.innerHTML,
    '<ul><!--before--><li>item1</li><li>item2bis</li><li>item3</li><!--after--></ul>',
  );
});

test('list is rendered and item within list is added', ({ eq }) => {
  const el = fromView(
    ({ html }) =>
      ({ items = [] }) =>
        // prettier-ignore
        html`<ul>${items.map(({ content, id }) => html`${id}::<li>${content}</li>`)}</ul>`,
  );

  debug.appendChild(el);
  eq(el.innerHTML, '<ul><!--before--><!--after--></ul>');
  el.render({
    items: [
      { id: 1, content: 'item1' },
      { id: 2, content: 'item2' },
      { id: 3, content: 'item3' },
    ],
  });

  eq(
    el.innerHTML,
    '<ul><!--before--><li>item1</li><li>item2</li><li>item3</li><!--after--></ul>',
  );

  el.render({
    items: [
      { id: 1, content: 'item1' },
      { id: 11, content: 'item11' },
      { id: 2, content: 'item2' },
      { id: 3, content: 'item3' },
    ],
  });

  eq(
    el.innerHTML,
    '<ul><!--before--><li>item1</li><li>item11</li><li>item2</li><li>item3</li><!--after--></ul>',
  );
});

test('list is rendered and item within list is removed', ({ eq }) => {
  const el = fromView(
    ({ html }) =>
      ({ items = [] }) =>
        // prettier-ignore
        html`<ul>${items.map(({ content, id }) => html`${id}::<li>${content}</li>`)}</ul>`,
  );

  debug.appendChild(el);
  eq(el.innerHTML, '<ul><!--before--><!--after--></ul>');
  el.render({
    items: [
      { id: 1, content: 'item1' },
      { id: 2, content: 'item2' },
      { id: 3, content: 'item3' },
    ],
  });

  eq(
    el.innerHTML,
    '<ul><!--before--><li>item1</li><li>item2</li><li>item3</li><!--after--></ul>',
  );

  el.render({
    items: [
      { id: 1, content: 'item1' },
      { id: 3, content: 'item3' },
    ],
  });

  eq(
    el.innerHTML,
    '<ul><!--before--><li>item1</li><li>item3</li><!--after--></ul>',
  );
});

test('list within a list is handled', ({ eq }) => {
  const el = fromView(
    ({ html }) =>
      ({ items = [] }) =>
        // prettier-ignore
        html`<ul>${items.map(({ children, id }) => html`${id}::<li><ul>${children.map(({ content, id: childId }) => html`${id+'-'+childId}::<li>${content}</li>`)}</ul></li>`)}</ul>`,
  );

  debug.appendChild(el);
  eq(el.innerHTML, '<ul><!--before--><!--after--></ul>');
  el.render({
    items: [
      {
        id: 1,
        children: [
          { content: 'item1', id: 'ch-1' },
          { content: 'item2', id: 'ch-2' },
        ],
      },
      { id: 2, children: [{ content: 'item11', id: 'ch-11' }] },
      {
        id: 3,
        children: [
          { content: 'item3', id: 'ch-3' },
          { content: 'item4', id: 'ch-4' },
          { content: 'item5', id: 'ch-5' },
        ],
      },
    ],
  });

  eq(
    el.innerHTML,
    '<ul><!--before--><li><ul><!--before--><li>item1</li><li>item2</li><!--after--></ul></li><li><ul><!--before--><li>item11</li><!--after--></ul></li><li><ul><!--before--><li>item3</li><li>item4</li><li>item5</li><!--after--></ul></li><!--after--></ul>',
  );

  el.render({
    items: [
      {
        id: 1,
        children: [{ content: 'item1', id: 'ch-1' }],
      },
      {
        id: 2,
        children: [
          { content: 'item11', id: 'ch-11' },
          { content: 'item2', id: 'ch-2' },
        ],
      },
      {
        id: 3,
        children: [
          { content: 'item3', id: 'ch-3' },
          { content: 'item4bis', id: 'ch-4' },
          { content: 'item5', id: 'ch-5' },
        ],
      },
    ],
  });

  eq(
    el.innerHTML,
    '<ul><!--before--><li><ul><!--before--><li>item1</li><!--after--></ul></li><li><ul><!--before--><li>item11</li><li>item2</li><!--after--></ul></li><li><ul><!--before--><li>item3</li><li>item4bis</li><li>item5</li><!--after--></ul></li><!--after--></ul>',
  );
});
