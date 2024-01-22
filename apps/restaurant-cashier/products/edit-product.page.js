import { createElement } from '../utils/dom.js';
import { productListService } from './product-list.service.js';
import { fromForm } from './product-list.model.js';
import { reactiveProps } from '../utils/components.js';
import { withView } from '@cofn/view';
export const loadPage = async ({ define, router, state }) => {
  define('app-edit-product', EditProductForm);
  const { ['product-sku']: sku } = state.navigation.params;
  // todo redirect to not found page if product does not exist
  // todo bis maybe set this check/redirect in a router middleware
  const product = await productListService.fetchOne({
    sku,
  });
  const el = createElement('app-edit-product');
  el.product = product;
  return el;
};

const EditProductForm = reactiveProps(['product'])(
  withView(({ html, router }) => {
    const handleSubmit = async (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      const { target: form } = ev;
      form.disabled = true;
      if (!form.checkValidity()) {
        return;
      }
      const product = fromForm(form);
      try {
        await productListService.update({ product });
        router.goTo('products');
      } finally {
        form.disabled = false;
      }
    };
    return ({ product }) => html`
        <h1 tabindex="-1"><span><ui-icon name="pencil-fill"></ui-icon>Edit product #${product.sku.toUpperCase()}</span></h1>
        <div class="surface transition-card boxed">
          <form autocomplete="off" novalidate @submit="${handleSubmit}" class="product-form">
              <input type="hidden" .value="${
                product.sku
              }" name="sku" type="text" required />
            <label is="ui-label">
              <span>title</span>
              <input .value="${
                product.title
              }" name="title" type="text" required />
            </label>
            <label is="ui-label">
              <span>description</span>
              <textarea .value="${
                product.description
              }" name="description"></textarea>
            </label>
            <label is="ui-label">
              <span>price($)</span>
              <input inputmode="numeric" .value="${
                product.price.amountInCents / 100
              }" pattern="\\d+(\\.\\d+)?" name="price" type="text" required />
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
                <ui-icon name="pencil-fill"></ui-icon>
                update
              </button>
            </div>
          </form>
        </div>
      `;
  }),
);
