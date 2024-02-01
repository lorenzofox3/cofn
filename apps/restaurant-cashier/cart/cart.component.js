export const Cart = ({ html, cartService }) => {
  cartService.fetchCurrent();

  return ({ currentCart }) => {
    const cartProducts = Object.entries(currentCart.items).map(
      ([sku, cartItem]) => ({
        sku,
        ...cartItem,
      }),
    );

    const hasItem = cartProducts.length > 0;

    return html`<h2>Current open cart</h2>
      ${hasItem === false
        ? html`<p>cart is currently empty</p>`
        : html` <table>
            <thead>
              <tr>
                <th>product</th>
                <th>quantity</th>
                <th>price</th>
              </tr>
            </thead>
            <tbody>
              ${cartProducts.map(
                ({
                  sku,
                  quantity,
                  price = { amountInCents: 0, currency: '$' },
                }) => {
                  return html`${'cart-item-' + sku}::
                    <tr>
                      <td>${sku}</td>
                      <td>${quantity}</td>
                      <td>${price.amountInCents + price.currency}</td>
                    </tr>`;
                },
              )}
            </tbody>
          </table>`}`;
  };
};

/**
 *       <div class="action-bar">
 *               <button>
 *                 <ui-icon name="cart-x"></ui-icon>
 *                 abandon
 *               </button>
 *               <button class="action">
 *                 <ui-icon name="coin"></ui-icon>
 *                 pay
 *               </button>
 *             </div>
 */
