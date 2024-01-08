import { withView } from '@cofn/view';

export const ProductListItemComponent = withView(
  ({ html }) =>
    ({ product }) =>
      html`<article class="product-card boxed surface">
        <header>
          <h2 class="text-ellipsis">${product.title}</h2>
          <button class="danger">
            <ui-icon name="x"></ui-icon> <span>remove</span>
          </button>
        </header>
        <div class="image-container"></div>
        <p class="description">${product.description}</p>
        <div>
          <a class="sku" href="/">#${product.sku}</a>
          <span class="price">
            <span>${product.price.amountInCents}</span>
            <span>${product.price.currency}</span>
          </span>
        </div>
      </article>`,
);
