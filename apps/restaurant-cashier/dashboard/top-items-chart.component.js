export const TopItemsChart =
  ({ html }) =>
  ({ items = [], summary = {} } = {}) => {
    return html`<h2 id="top-items-heading">Top items - counts</h2>
      <ui-bar-chart
        orientation="horizontal"
        domain-min="0"
        aria-labelledby="top-items-heading"
        class="skeleton"
        >${items.map(({ label, value }) => {
          return html`${'bar-' + label}::<ui-bar value="${value}"
              ><span>${value}</span></ui-bar
            >`;
        })}${items.length
          ? html`${items.map(
              ({ label }) =>
                html`${'label-' + label}::<span slot="category"
                    >${label}</span
                  >`,
            )}`
          : null}</ui-bar-chart
      >`;
  };
