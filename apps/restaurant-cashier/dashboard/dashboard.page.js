import { createElement } from '../utils/dom.js';
import { withView } from '@cofn/view';
import { RevenuesChart } from './revenues-chart.component.js';
import { UIBar } from '../components/charts/ui-bar.component.js';
import { UIBarChart } from '../components/charts/ui-bar-chart.component.js';
import { UICategoryAxis } from '../components/charts/ui-category-axis.component.js';
import { withChartData } from './dashboard.controller.js';
import { CartCountChart } from './cart-count.component.js';
import { UIBarStack } from '../components/charts/ui-bar-stack.component.js';

const template = createElement('template');
template.innerHTML = `<h1 tabindex="-1">Weekly dashboard</h1>
<div id="dashboard" class="grid-full">
  <app-revenues-chart data-url="reports/revenues" class="boxed data-viz"></app-revenues-chart>
  <app-cart-count-chart data-url="reports/cart-count" class="boxed data-viz"></app-cart-count-chart>

  <article class="surface boxed data-viz">
    <h2>Top Items</h2>
    <span class="total"></span>
    <chart-area class="skeleton"></chart-area>
  </article>
  <article class="surface boxed data-viz">
      <h2>Cancellations</h2>
      <span class="total"></span>
      <chart-area class="skeleton"></chart-area>
  </article>
</div>`;

export const loadPage = ({ define }) => {
  define('ui-bar', UIBar, { observedAttributes: ['size'] });
  define('ui-bar-stack', UIBarStack, {
    shadow: { mode: 'open' },
  });
  define('ui-category-axis', UICategoryAxis);
  define('ui-bar-chart', UIBarChart, {
    observedAttributes: ['domain-min', 'domain-max'],
    shadow: {
      mode: 'open',
    },
  });
  define('app-revenues-chart', withChartData(withView(RevenuesChart)));
  define('app-cart-count-chart', withChartData(withView(CartCountChart)));

  return template.content.cloneNode(true);
};
