import { createElement } from '../utils/dom.js';
import { withView } from '@cofn/view';
import { Cart } from './cart.component.js';
import { CartProductList } from './cart-product-list.component.js';

const template = createElement('template');
template.innerHTML = `
<h1>Cart</h1>
<app-cart class="surface boxed"></app-cart>
<app-cart-product-list class="surface boxed"></app-cart-product-list>
`;

export const loadPage = ({ define }) => {
  define('app-cart', withView(Cart));
  define('app-cart-product-list', withView(CartProductList));
  return template.content.cloneNode(true);
};
