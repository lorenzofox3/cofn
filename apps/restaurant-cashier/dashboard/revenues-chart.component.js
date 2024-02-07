import { createProjection } from '../components/charts/util.js';

const twoDecimalOnly = (val) => Math.floor(val * 100) / 100;
const model = ({ items = [], summary = {} } = {}) => {
  return {
    summary: {
      amount: summary.amountInCents / 100,
      currency: summary.currency,
    },
    items: items.map(({ value, label }) => ({
      label,
      amount: value / 100,
    })),
  };
};
const project = createProjection({
  domainMin: 0,
  domainMax: 953,
});

const formatLabel = (label) => label.split('/').slice(0, 2).join('/');

export const RevenuesChart =
  ({ html }) =>
  (data) => {
    const { items = [], summary = {} } = model(data);
    return html`<h2 id="revenues-heading">Revenues</h2>
      <strong
        >${summary.amount ? summary.amount + summary.currency : ''}</strong
      >
      <ui-bar-chart
        domain-min="0"
        aria-labelledby="revenues-heading"
        class="skeleton"
        >${items.map(({ label, amount }, i) => {
          return html`${'bar-' + label}::<ui-bar value="${amount}"
              >${amount + '$'}</ui-bar
            >`;
        })}${items.length
          ? html`<ui-category-axis
              >${items.map(
                ({ label }) =>
                  html`${'label-' + label}::<span>${formatLabel(label)}</span>`,
              )}</ui-category-axis
            >`
          : null}</ui-bar-chart
      >`;
  };
