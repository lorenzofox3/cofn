import { querySelector } from '../../utils/dom.js';

export const ProductList = ({
  html,
  $host,
  animationService,
  productListService,
}) => {
  setTimeout(productListService.fetch, 200); // todo remove (when we have a real backend and do not rely on service worker)

  $host.addEventListener('product-removed', async ({ detail }) => {
    const { sku } = detail;
    const itemToRemove = $host.querySelector(`[data-id=${sku}]`);
    await animationService.removeElement(itemToRemove);
    productListService.remove({ sku });
  });

  function transitionCard() {
    // remove any precedent reduced card
    querySelector('.transition-card-collapse')?.classList.remove(
      'transition-card-collapse',
    );
    this.classList.add('transition-card-expand');
  }

  return ({ products, attributes }) => {
    const { ['target-sku']: targetSku } = attributes;
    return html`
      <h1 id="page-header" tabindex="-1">Product list</h1>
      <div id="list-section" aria-labelledby="page-header">
        <div @click="${transitionCard}">
          <a class="button-like" is="ui-page-link" href="/products/new">
            <ui-icon name="plus-circle"></ui-icon>
            Add new</a
          >
        </div>
        ${products.map((product) => {
          const classList = [
            'boxed',
            'surface',
            ...(product.sku === targetSku ? ['transition-card-collapse'] : []),
          ];
          return html`${product.sku}::<app-product-list-item
              data-id="${product.sku}"
              class="${classList.join(' ')}"
              .product="${product}"
              @click="${transitionCard}"
            ></app-product-list-item>`;
        })}
      </div>
    `;
  };
};
