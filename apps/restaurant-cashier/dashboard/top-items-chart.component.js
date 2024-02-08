export const TopItemsChart =
  ({ html }) =>
  ({ items = [], summary = {} } = {}) => {
    return html`<h2 id="cart-count-heading">Top items</h2>
      <ui-bar-chart
        orientation="horizontal"
        domain-min="0"
        aria-labelledby="cart-count-heading"
        class="skeleton"
        >${items.map(({ sku, count }) => {
          return html`${'bar-' + sku}::<ui-bar value="${count}"
              ><span>${count}</span></ui-bar
            >`;
        })}${items.length
          ? html`${items.map(
              ({ sku }) =>
                html`${'label-' + sku}::<span slot="category">${sku}</span>`,
            )}`
          : null}</ui-bar-chart
      >`;
  };
