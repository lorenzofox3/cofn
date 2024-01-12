import { createElement } from '../utils/dom.js';

const template = createElement('template');

template.innerHTML = `
<h1 tabindex="-1">Add new product</h1>
<div class="surface boxed">
  <form class="product-form">
      <label>
        <span>sku</span>
        <input autofocus name="sku" type="text" required />
      </label>
      <label>
        <span>title</span>
        <input name="title" type="text" required />
      </label>
      <label>
        <span>description</span>
        <textarea name="description"></textarea>
      </label>
      <label>
        <span>price</span>
        <input pattern="\\d+(\\.\\d+)?" name="price" type="text" required />
      </label>
      <label>
        <span>picture</span>
        <ui-file-input>
          <input class="button-like" type="file">
        </ui-file-input>
      </label>
      <div class="action-bar">
        <a href="/products" is="ui-page-link" class="button-like">
        <span><ui-icon name="x-circle"></ui-icon>cancel</a>
        <button class="action">
          <ui-icon name="plus-circle"></ui-icon>
          create
        </button>
      </div>
  </form>
</div>`;
export const loadPage = async () => {
  const handleSubmit = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    console.log('submit');
  };
  const page = template.content.cloneNode(true);
  page.querySelector('form').addEventListener('submit', handleSubmit);
  return page;
};
