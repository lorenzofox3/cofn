import { compose } from '../utils/functions.js';
import { createProductListController } from './product-list.controller.js';
import { createProductListService } from './product-list.service.js';
import { withView } from '@cofn/view';
import { define } from '@cofn/core';
import { createProductListComponent } from './product-list.component.js';

const connectedProductListView = compose([
  createProductListController({
    productListService: createProductListService(),
  }),
  withView,
]);

define(
  'app-product-list',
  connectedProductListView(createProductListComponent),
);
