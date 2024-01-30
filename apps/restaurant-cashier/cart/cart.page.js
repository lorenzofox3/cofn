import { createElement } from '../utils/dom.js';
import { withView } from '@cofn/view';
import { Cart } from './cart.component.js';
import { CartProductList } from './cart-product-list.component.js';

const template = createElement('template');
template.innerHTML = `
<h1 tabindex="-1">Cart</h1>
<div class="grid-full">
<app-cart class="surface grid-full boxed"></app-cart>
<app-cart-product-list class="surface grid-full boxed"></app-cart-product-list>
</div>
`;

export const loadPage = ({ define }) => {
  define('app-cart', withView(Cart));
  define('app-cart-product-list', withView(CartProductList));
  return template.content.cloneNode(true);
};
