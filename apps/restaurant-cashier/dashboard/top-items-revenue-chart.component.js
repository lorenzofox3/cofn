export const TopItemsRevenueChart =
  ({ html }) =>
  ({ items = [], summary = {} } = {}) => {
    return html`<h2 id="top-item-revenue-heading">Top items - revenue</h2>
      <bpapa-bar-chart
        horizontal
        domain-min="0"
        aria-labelledby="top-item-revenue-heading"
        class="skeleton"
        >${items.map(({ label, value }) => {
          return html`${'bar-' + label}::<bpapa-bar value="${value}"
              ><span>${value / 100}$</span></bpapa-bar
            >`;
        })}${items.length
          ? html`${items.map(
              ({ label }) =>
                html`${'label-' + label}::<span slot="category"
                    >${label}</span
                  >`,
            )}`
          : null}</bpapa-bar-chart
      >`;
  };
