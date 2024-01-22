import { createElement } from '../utils/dom.js';
import { productListService } from './product-list.service.js';
import { fromForm, productSkus } from './product-list.model.js';

const template = createElement('template');

template.innerHTML = `
<h1 tabindex="-1"><span><ui-icon name="plus-circle"></ui-icon>Add new product</span></h1>
<div class="surface transition-card boxed">
  <form autocomplete="off" class="product-form" novalidate>
      <label is="ui-label">
        <span>#SKU</span>
        <input autocapitalize="characters" placeholder="ex: bigmc" name="sku" type="text" required />
      </label>
      <label is="ui-label">
        <span>title</span>
        <input formnovalidate placeholder="ex: Big Mac" name="title" type="text" required />
      </label>
      <label is="ui-label">
        <span>description</span>
        <textarea placeholder="ex: The big mac is an hamburger " name="description"></textarea>
      </label>
      <label is="ui-label">
        <span>price($)</span>
        <input inputmode="numeric" placeholder="ex: 42.99" pattern="\\d+(\\.\\d+)?" name="price" type="text" required />
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
        <button formnovalidate class="action">
          <ui-icon name="plus-circle"></ui-icon>
          create
        </button>
      </div>
  </form>
</div>`;
export const loadPage = async ({ router }) => {
  let skus = productSkus(productListService.getState());

  // Eventually load new items
  productListService.fetch().then(() => {
    skus = productSkus(productListService.getState());
  });

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const { target: form } = ev;
    const { sku: skuEl } = form.elements;
    const isSKUAlreadyUsed = skus.includes(skuEl.value);
    skuEl.setCustomValidity(
      isSKUAlreadyUsed
        ? `SKU should be unique but "${skuEl.value.toUpperCase()}" is already used`
        : '',
    );

    if (!form.checkValidity()) {
      return;
    }

    form.disabled = true;
    const product = fromForm(form);
    try {
      await productListService.create({ product });
      router.goTo('products');
    } finally {
      form.disabled = false;
    }
  };
  const page = template.content.cloneNode(true);
  const form = page.querySelector('form');
  form.addEventListener('submit', handleSubmit);
  return page;
};
