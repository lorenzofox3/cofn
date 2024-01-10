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
            <ui-icon name="x"></ui-icon> <span>remove</span>
          </button>
        </header>
        <div class="image-container"></div>
        <p class="description">${product.description}</p>
        <div>
          <a class="sku" href="/">#${product.sku}</a>
          <span class="price">
            <span>${product.price?.amountInCents}</span>
            <span>${product.price?.currency}</span>
          </span>
        </div>
      </article>`;
  },
);
