export const ProductList = ({
  html,
  $host,
  $signal,
  animationService,
  productListService,
}) => {
  productListService.fetch();

  $host.addEventListener(
    'product-removed',
    async ({ detail }) => {
      const { sku } = detail;
      const itemToRemove = $host.querySelector(`[data-id=${sku}]`);
      await animationService.removeElement(itemToRemove);
      productListService.remove({ sku });
    },
    { signal: $signal },
  );

  function transitionCard() {
    this.classList.add('transition-card');
  }

  return ({ products }) => {
    return html`
      <h1 id="page-header" tabindex="-1">Product list</h1>
      <div id="list-section" aria-labelledby="page-header">
        <div @click="${transitionCard}">
          <a class="button-like" is="ui-page-link" href="/products/new">
            <ui-icon name="plus-circle"></ui-icon>
            Add new</a
          >
        </div>
        ${products.map(
          (product) =>
            html`${product.sku}::<app-product-list-item
                data-id="${product.sku}"
                class="boxed surface"
                .product="${product}"
                @click="${transitionCard}"
              ></app-product-list-item>`,
        )}
      </div>
    `;
  };
};
