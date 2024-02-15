import { compose } from '../../utils/functions.js';
import { createProductListController } from '../product-list.controller.js';
import { productListService } from '../product-list.service.js';
import { withView } from '@cofn/view';
import { ProductList } from './product-list.component.js';
import { ProductListItem } from './product-list-item.component.js';
import { createElement } from '../../utils/dom.js';

const connectedProductListView = compose([
  createProductListController({
    productListService,
  }),
  withView,
]);
export const loadPage = async ({ define, state }) => {
  define('app-product-list-item', ProductListItem);
  define('app-product-list', connectedProductListView(ProductList));
  const element = createElement('app-product-list');
  if (state?.sku) {
    element.setAttribute('target-sku', state.sku);
  }
  return element;
};
