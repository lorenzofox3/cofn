import { createElement } from '../../utils/dom.js';
import { productListService } from '../product-list.service.js';
import { fromForm, productSkus } from '../product-list.model.js';
import { define } from '@cofn/core';
import { ImageUploader } from '../image-uploader/image-uploader.component.js';

const template = createElement('template');

template.innerHTML = `
<h1 tabindex="-1">Add new product</h1>
<div class="surface content-grid transition-card-expand boxed">
  <form autocomplete="off" class="grid-narrow product-form" novalidate>
      <label is="ui-label">
        <span>SKU</span>
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
        <app-image-uploader></app-image-uploader>
      </label>
      <input type="hidden" name="image">
      <div class="action-bar">
        <a href="/products" is="ui-page-link" class="button-like">
          <ui-icon name="x-circle"></ui-icon>cancel
        </a>
        <button formnovalidate class="action">
          <ui-icon name="plus-circle"></ui-icon>create
        </button>
      </div>
  </form>
</div>`;
export const loadPage = async ({ router }) => {
  define('app-image-uploader', ImageUploader, {
    observedAttributes: ['url', 'status'],
    shadow: {
      mode: 'open',
      delegatesFocus: true,
    },
  });
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
    productListService.create({ product });
    form.parentElement.classList.toggle('transition-card-expand');
    form.parentElement.classList.toggle('transition-card-collapse');
    router.goTo('products', product);
  };
  const page = template.content.cloneNode(true);
  const form = page.querySelector('form');
  form.addEventListener('submit', handleSubmit);
  form
    .querySelector('app-image-uploader')
    .addEventListener(
      'image-uploaded',
      ({ detail }) => (form.querySelector('[name=image]').value = detail.url),
    );
  return {
    title: 'New product',
    content: page,
  };
};
