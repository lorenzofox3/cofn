const itemQuantityFromEvent = (ev) => {
  const nodes = ev.composedPath();
  const skuEl = nodes.find((el) => el.dataset?.id !== undefined);
  const actionEl = nodes.find((el) => el.dataset?.action !== undefined);
  if (!skuEl || !actionEl) {
    return undefined;
  }

  const { quantity, id: sku } = skuEl.dataset;
  const { action } = actionEl.dataset;
  return {
    sku,
    quantity: Number(quantity) + (action === 'increment' ? 1 : -1),
  };
};

export const Cart = ({ html, cartService, $host }) => {
  setTimeout(cartService.fetchCurrent, 200); // todo

  $host.addEventListener('click', (ev) => {
    ev.stopPropagation();
    const itemQuantity = itemQuantityFromEvent(ev);
    if (itemQuantity) {
      cartService.setItemQuantity(itemQuantity);
    }
  });

  return ({ currentCart, products }) => {
    const cartProducts = Object.entries(currentCart.items).map(
      ([sku, cartItem]) => ({
        ...products[sku],
        ...cartItem,
      }),
    );

    const hasItem = cartProducts.length > 0;

    return html`<h2>Your cart</h2>
      <ul>
        ${cartProducts.map(({ title, sku, quantity, price }) => {
          return html`${'cart-item-' + sku}::
            <li data-id="${sku}" data-quantity="${quantity}">
              <div class="text-ellipsis title">
                ${title}<small>ref - ${sku}</small>
              </div>
              <div class="quantity">
                <button data-action="increment">
                  <ui-icon name="plus"></ui-icon> <span>add</span>
                </button>
                <span>${quantity}</span>
                <button data-action="decrement">
                  <ui-icon name="dash"></ui-icon> <span>remove</span>
                </button>
              </div>
              <span>${price.amountInCents / 100 + price.currency}</span>
            </li>`;
        })}
      </ul>
      ${hasItem
        ? html`<p>
            For a total of
            <strong
              >${currentCart.total.amountInCents / 100 +
              currentCart.total.currency}
            </strong>
          </p>`
        : html`<p>cart is currently empty</p>`}
      <div class="action-bar">
        <button disabled="${!hasItem}">
          <ui-icon name="cart-x"></ui-icon>
          abandon
        </button>
        <button disabled="${!hasItem}" class="action">
          <ui-icon name="coin"></ui-icon>
          pay
        </button>
      </div> `;
  };
};
