import { createElement } from '../../utils/dom.js';

const template = createElement('template');
template.innerHTML = `<style>
:host {
  display: grid;
  grid-template-areas: 
   "bar-area"
   "category-axis";
  grid-template-rows: 1fr auto;
}

#bar-area {
    display: grid;
    grid-auto-flow: column;
    justify-items: center;
    align-items: flex-end;
    grid-area: bar-area;
}

::slotted(ui-bar) {
    block-size: var(--bar-size, 0%);
    inline-size: min(75%, 70px);
    transition: block-size var(--animation-duration);
}

::slotted(ui-category-axis){
  display: grid;
  grid-column: 1 / span var(--_bar-count);
  grid-template-columns: subgrid;
  grid-auto-flow: column;
}


</style>
<div id="bar-area">
  <slot name="bar-area"></slot>
</div>
<div id="category-axis">
  <slot name="category-axis"></slot>
</div>
`;

export function* UIBarChart({ $root, $host }) {
  $root.appendChild(template.content.cloneNode(true));
  $root
    .querySelector('[name=bar-area]')
    .addEventListener('slotchange', ({ target }) =>
      $host.style.setProperty('--_bar-count', target.assignedElements().length),
    );
}
