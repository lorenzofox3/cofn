const formatLabel = (label) => label.split('/').slice(0, 2).join('/');

export const CartCountChart =
  ({ html }) =>
  ({ items = [], summary = {} } = {}) => {
    return html`<h2 id="cart-count-heading">Cart count</h2>
      <div class="legend">
        ${summary.succeeded
          ? html`<div>success: ${summary.succeeded}</div>
              <div>fails: ${summary.failed}</div>`
          : null}
      </div>
      <ui-bar-chart
        domain-min="0"
        aria-labelledby="cart-count-heading"
        class="skeleton"
        >${items.map(({ label, succeeded, failed }) => {
          return html`${'bar-' + label}::<ui-bar-group
              ><ui-bar value="${succeeded}"><span>${succeeded}</span></ui-bar
              ><ui-bar value="${failed}"
                ><span>${failed}</span></ui-bar
              ></ui-bar-group
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
