import { compose } from '../utils/functions.js';
import { createProductListController } from './product-list.controller.js';
import { productListService } from './product-list.service.js';
import { withView } from '@cofn/view';
import { define } from '@cofn/core';
import { ProductList } from './product-list.component.js';
import { ProductListItemComponent } from './product-list-item.component.js';

const connectedProductListView = compose([
  createProductListController({
    productListService,
  }),
  withView,
]);

export const loadPage = async () => {
  define('app-product-list-item', ProductListItemComponent);
  define('app-product-list', connectedProductListView(ProductList));

  return document.createElement('app-product-list');
};
