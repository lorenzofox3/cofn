export const Cart =
  ({ html }) =>
  () =>
    html`<div>
      <p>your cart is empty</p>
      <div class="action-bar">
        <button><ui-icon name="cart-x"></ui-icon>abandon</button>
        <button class="action"><ui-icon name="coin"></ui-icon>pay</button>
      </div>
    </div>`;
