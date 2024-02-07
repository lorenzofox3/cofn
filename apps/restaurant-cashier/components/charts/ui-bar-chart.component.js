import { createElement } from '../../utils/dom.js';
import { createProjection, twoDecimalOnly } from './util.js';

const template = createElement('template');
template.innerHTML = `<style>
:host {
  display: grid;
}

#bar-area {
    display: grid;
    grid-template-rows: 1fr auto;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    justify-items: center;
    align-items: flex-end;
}

::slotted(ui-bar) {
    block-size: var(--bar-size, 0%);
    inline-size: min(75%, 70px);
    transition: block-size var(--animation-duration);
    overflow: hidden;
}

::slotted(ui-bar-stack) {
  block-size: 100%;
  inline-size: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
}

::slotted(ui-category-axis){
  display: grid;
  grid-column: 1 / span var(--_bar-count);
  grid-template-columns: subgrid;
  grid-auto-flow: column;
  grid-row: 2;
}


</style>
<div id="bar-area">
  <slot name="bar-area"></slot>
  <slot name="category-axis"></slot>
</div>
`;

export function* UIBarChart({ $root, $host }) {
  $root.appendChild(template.content.cloneNode(true));
  const barArea = $root.querySelector('[name=bar-area]');

  Object.defineProperties($host, {
    domainMin: {
      enumerable: true,
      get() {
        return $host.hasAttribute('domain-min')
          ? Number($host.getAttribute('domain-min'))
          : Math.min(...barArea.assignedElements().map(({ value }) => value));
      },
    },
    domainMax: {
      enumerable: true,
      get() {
        return $host.hasAttribute('domain-max')
          ? Number($host.getAttribute('domain-max'))
          : Math.max(...barArea.assignedElements().map(({ value }) => value));
      },
    },
  });

  barArea.addEventListener('slotchange', $host.render);

  while (true) {
    yield;
    $host.style.setProperty('--_bar-count', barArea.assignedElements().length);
    const project = createProjection($host);
    barArea
      .assignedElements()
      .flatMap((bar) => [bar, ...Array.from(bar.children)])
      .filter(({ localName }) => localName === 'ui-bar')
      .forEach((bar) =>
        bar.setAttribute('size', twoDecimalOnly(project(bar.value))),
      );
  }
}
