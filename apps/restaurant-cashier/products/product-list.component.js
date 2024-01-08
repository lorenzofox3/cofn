export const ProductList = ({ html, productListService }) => {
  productListService.fetch();

  return ({ products }) => {
    return html`
      <h1 tabindex="-1">Product list</h1>
      <div id="list-section">
        <div>
          <a class="action button-like">
            <ui-icon name="plus"></ui-icon>
            Add new</a
          >
        </div>
        ${products.map(
          (product) =>
            html`${product.sku}::<app-product-list-item
                class="boxed surface"
                .product="${product}"
              ></app-product-list-item>`,
        )}
      </div>
    `;
  };
};
