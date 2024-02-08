const formatLabel = (label) => label.split('/').slice(0, 2).join('/');

export const CartCountChart =
  ({ html }) =>
  ({ items = [], summary = {} } = {}) => {
    return html`<h2 id="cart-count-heading">Cart count</h2>
      <strong
        >${summary.succeeded ? 'succeeded: ' + summary.succeeded : ''}</strong
      >
      <ui-bar-chart
        domain-min="0"
        aria-labelledby="cart-count-heading"
        class="skeleton"
        >${items.map(({ label, succeeded, failed }) => {
          return html`${'bar-' + label}::<ui-bar-stack
              ><ui-bar value="${succeeded}">${succeeded}</ui-bar
              ><ui-bar value="${failed}">${failed}</ui-bar></ui-bar-stack
            >`;
        })}${items.length
          ? html`${items.map(
              ({ label }) =>
                html`${'label-' + label}::<span slot="category"
                    >${formatLabel(label)}</span
                  >`,
            )}`
          : null}</ui-bar-chart
      >`;
  };
