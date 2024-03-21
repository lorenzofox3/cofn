import { createElement } from '../utils/dom.js';
import { withView } from '@cofn/view';
import { RevenuesChart } from './revenues-chart.component.js';
import { withChartData } from './dashboard.controller.js';
import { CartCountChart } from './cart-count-chart.component.js';
import { TopItemsChart } from './top-items-chart.component.js';
import { compose } from '../utils/functions.js';
import { TopItemsRevenueChart } from './top-items-revenue-chart.component.js';
import 'barbapapa';

const template = createElement('template');
template.innerHTML = `<h1 tabindex="-1">Weekly dashboard</h1>
<div id="dashboard" class="grid-full">
  <app-revenues-chart data-url="reports/revenues" class="boxed data-viz"></app-revenues-chart>
  <app-cart-count-chart data-url="reports/cart-count" class="boxed data-viz"></app-cart-count-chart>
  <app-top-items-chart data-url="reports/top-items" class="boxed data-viz"></app-top-items-chart>
  <app-top-items-revenue-chart data-url="reports/top-items-revenue" class="boxed data-viz"></app-top-items-revenue-chart>
</div>`;

const chart = compose([withChartData, withView]);
export const loadPage = ({ define }) => {
  define('app-revenues-chart', chart(RevenuesChart));
  define('app-cart-count-chart', chart(CartCountChart));
  define('app-top-items-chart', chart(TopItemsChart));
  define('app-top-items-revenue-chart', chart(TopItemsRevenueChart));

  return {
    title: 'Dashboard',
    content: template.content.cloneNode(true),
  };
};
