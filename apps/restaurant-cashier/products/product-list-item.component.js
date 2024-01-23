import { withView } from '@cofn/view';
import { compose } from '../utils/functions.js';
import { reactiveProps } from '../utils/components.js';

const compositionPipeline = compose([reactiveProps(['product']), withView]);

export const ProductListItemComponent = compositionPipeline(
  ({ html, $host }) => {
    const onclickHandler = (ev) => {
      ev.stopPropagation();
      ev.target.disabled = true;
      $host.dispatchEvent(
        new CustomEvent('product-removed', {
          bubbles: true,
          detail: {
            sku: $host.product.sku,
          },
        }),
      );
    };

    return ({ product = {} }) =>
      html`<article class="product-card">
        <header>
          <h2 class="text-ellipsis">${product.title}</h2>
          <button @click="${onclickHandler}" class="danger">
            <ui-icon name="x-circle"></ui-icon> <span>remove</span>
          </button>
        </header>
        <div class="product-card__image-container">
          ${product.image?.url
            ? html`<img src="${product.image.url}" alt="product image" />`
            : null}
        </div>
        <p class="product-card__description">${product.description ?? ''}</p>
        <div>
          <a
            class="product-card__sku"
            href="${'/products/' + product.sku}"
            is="ui-page-link"
            >#${product.sku}</a
          >
          <span class="product-card__price">
            <span>${product.price.amountInCents / 100}</span>
            <span>${product.price.currency}</span>
          </span>
        </div>
      </article>`;
  },
);
