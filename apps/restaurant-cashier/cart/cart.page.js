import { createElement } from '../utils/dom.js';
import { withView } from '@cofn/view';
import { Cart } from './cart.component.js';
import { CartProductList } from './cart-product-list.component.js';
import { createProductListController } from '../products/product-list.controller.js';
import { productListService } from '../products/product-list.service.js';
import { CartProductItem } from './cart-product-item.component.js';
import {
  UIListbox,
  UIListboxOption,
} from '../components/ui-listbox.component.js';

const template = createElement('template');
template.innerHTML = `
<h1 tabindex="-1">Cart</h1>
<div id="cart-container" class="grid-full">
  <app-cart class="surface boxed"></app-cart>
  <app-cart-product-list></app-cart-product-list>
</div>
`;

export const loadPage = ({ define }) => {
  define('ui-listbox-option', UIListboxOption, {
    extends: 'li',
  });
  define('ui-listbox', UIListbox, {
    extends: 'ul',
  });
  define('app-cart', withView(Cart));
  define('app-cart-product-item', CartProductItem);
  define(
    'app-cart-product-list',
    createProductListController({ productListService })(
      withView(CartProductList),
    ),
  );
  return template.content.cloneNode(true);
};
