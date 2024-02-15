import { compose } from '../utils/functions.js';
import { reactiveProps } from '../utils/components.js';
import { withView } from '@cofn/view';

const compositionPipeline = compose([reactiveProps(['product']), withView]);

export const CartProductItem = compositionPipeline(({ html, $host }) => {
  return ({ product }) => {
    if (product.image?.url) {
      $host.style.setProperty('background-image', `url(${product.image.url})`);
    }

    return html`
      <div class="text-ellipsis text">${product.title}</div>
      <div aria-hidden="true" class="adorner">
        <ui-icon name="check"></ui-icon>
      </div>
      <div aria-hidden="true" class="text">
        <span>#${product.sku}</span>
        <div>
          <span>${product.price.amountInCents / 100}</span>
          <span>${product.price.currency}</span>
        </div>
      </div>
    `;
  };
});
