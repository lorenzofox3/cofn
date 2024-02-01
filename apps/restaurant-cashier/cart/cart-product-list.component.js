export const CartProductList = ({ html, productListService, $host }) => {
  setTimeout(productListService.fetch, 200);
  return ({ products }) =>
    html` <h2 id="product-list-header" class="visually-hidden">
        Available products
      </h2>
      <ul
        id="available-products-listbox"
        is="ui-listbox"
        aria-labelledby="product-list-header"
        aria-multiselectable="true"
        @selection-changed="${console.log}"
      >
        ${products.map(
          (product) =>
            html`${product.sku}::
              <li
                id="${'option-' + product.sku}"
                is="ui-listbox-option"
                class="boxed"
                value="${product.sku}"
              >
                <app-cart-product-item
                  .product="${product}"
                ></app-cart-product-item>
              </li>`,
        )}
      </ul>`;
};
