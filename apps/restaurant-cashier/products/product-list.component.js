export const createProductListComponent = ({ html, productListService }) => {
  productListService.fetch();

  return ({ products }) => {
    return html`
      <h1>Product list</h1>
      <div id="list-section">
        <div>
          <a class="action button-like">
            <ui-icon name="plus"></ui-icon>
            Add new</a
          >
        </div>
        ${products.map(
          (product) =>
            html`${product.sku}::
              <article class="product-card boxed surface">
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
              </article> `,
        )}
      </div>
    `;
  };
};
