import { http } from '../utils/http.js';
import { createProjection } from '../components/charts/util.js';
import { compose } from '../utils/functions.js';

const twoDecimalOnly = (val) => Math.floor(val * 100) / 100;
const model = ({ items, summary }) => {
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
export const withRevenueData = (comp) => {
  return function* ({ $host, $signal, ...rest }) {
    http('reports/revenues', { signal: $signal }).then(
      compose([$host.render, model]),
    );
    yield* comp({ $host, $signal, ...rest });
  };
};

const project = createProjection({
  domainMin: 0,
  domainMax: 1_000,
});

const formatLabel = (label) => label.split('/').slice(0, 2).join('/');

export const RevenuesChart =
  ({ html }) =>
  ({ items = [], summary = {} } = {}) => {
    return html`<h2>Revenues</h2>
      <strong
        >${summary.amount ? summary.amount + summary.currency : ''}</strong
      >
      <ui-bar-chart class="skeleton"
        >${items.map(({ label, amount }, i) => {
          return html`${'bar-' + label}::<ui-bar
              size="${twoDecimalOnly(project(amount))}"
              class="boxed"
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
