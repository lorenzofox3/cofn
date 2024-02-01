export const CartProductList = ({ html, productListService, cartService }) => {
  const handleSelectionChange = ({ detail }) => {
    const { option } = detail;
    const cartItem = {
      sku: option.value,
      quantity: option.selected ? 1 : 0,
    };
    cartService.setItemQuantity(cartItem);
  };
  return ({ products: _products }) => {
    const products = Object.values(_products);

    return html` <h2 id="product-list-header" class="visually-hidden">
        Available products
      </h2>
      <ul
        id="available-products-listbox"
        is="ui-listbox"
        aria-labelledby="product-list-header"
        aria-multiselectable="true"
        @selection-changed="${handleSelectionChange}"
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
};
