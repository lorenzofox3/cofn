import { compose } from '../utils/functions.js';

export const CartProductList = ({ html, productListService, cartService }) => {
  const handleSelectionChange = compose([
    cartService.setItemQuantity,
    cartItemFromOption,
    ({ detail }) => detail,
  ]);
  return ({ products: _products, currentCart }) => {
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

const cartItemFromOption = ({ value, selected }) => ({
  sku: value,
  quantity: selected ? 1 : 0,
});
