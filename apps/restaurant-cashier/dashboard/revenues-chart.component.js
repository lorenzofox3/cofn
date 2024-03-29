const model = ({ items = [], summary = {} } = {}) => {
  return {
    summary: {
      amount: Math.round(summary.amountInCents / 100),
      currency: summary.currency,
    },
    items: items.map(({ value, label }) => ({
      label,
      amount: Math.round(value / 100),
    })),
  };
};
const formatLabel = (label) => label.split('/').slice(0, 2).join('/');

export const RevenuesChart =
  ({ html }) =>
  (data) => {
    const { items = [], summary = {} } = model(data);
    return html`<h2 id="revenues-heading">Revenue</h2>
      <span>${summary.amount ? summary.amount + summary.currency : ''}</span>
      <bpapa-bar-chart
        domain-min="0"
        aria-labelledby="revenues-heading"
        class="skeleton"
        >${items.map(({ label, amount }, i) => {
          return html`${'bar-' + label}::<bpapa-bar value="${amount}"
              ><span>${amount + '$'}</span></bpapa-bar
            >`;
        })}${
          items.length
            ? html`${items.map(
                ({ label }) =>
                  html`${'label-' + label}::<span slot="category"
                      >${formatLabel(label)}</span
                    >`,
              )}`
            : null
        }</-bar-chart
      >`;
  };
