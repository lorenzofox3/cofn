import { createElement } from '../utils/dom.js';
import { withView } from '@cofn/view';
import { RevenuesChart, withRevenueData } from './revenues-chart.component.js';
import { UIBar } from '../components/charts/ui-bar.component.js';
import { UIBarChart } from '../components/charts/ui-bar-chart.component.js';
import { UICategoryAxis } from '../components/charts/ui-category-axis.component.js';

const template = createElement('template');
template.innerHTML = `<h1 tabindex="-1">Weekly dashboard</h1>
<div id="dashboard" class="grid-full">
  <app-revenues-chart class="surface boxed data-viz"></app-revenues-chart>
  <article class="surface boxed data-viz">
    <h2>Cart abondons</h2>
    <span class="total"></span>
    <chart-area class="skeleton"></chart-area>
  </article>
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
  define('ui-category-axis', UICategoryAxis);
  define('ui-bar-chart', UIBarChart, {
    shadow: {
      mode: 'open',
    },
  });
  define('app-revenues-chart', withRevenueData(withView(RevenuesChart)));

  return template.content.cloneNode(true);
};
