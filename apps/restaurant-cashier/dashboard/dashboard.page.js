import { createElement } from '../utils/dom.js';

const template = createElement('template');
template.innerHTML = `<h1 tabindex="-1">Weekly dashboard</h1>
<div class="grid-full"><p>Hello weekly dashboard</p></div>`;

export const loadPage = () => {
  return template.content.cloneNode(true);
};
