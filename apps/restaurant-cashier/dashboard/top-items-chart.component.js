export const TopItemsChart =
  ({ html }) =>
  ({ items = [], summary = {} } = {}) => {
    return html`<h2 id="top-items-heading">Top items - counts</h2>
      <bpapa-bar-chart
        horizontal
        domain-min="0"
        aria-labelledby="top-items-heading"
        class="skeleton"
        >${items.map(({ label, value }) => {
          return html`${'bar-' + label}::<bpapa-bar value="${value}"
              ><span>${value}</span></bpapa-bar
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
