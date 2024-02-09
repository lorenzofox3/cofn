import { createElement } from '../../utils/dom.js';
import { createProjection, twoDecimalOnly } from './util.js';

const template = createElement('template');
template.innerHTML = `<style>
:host {
  display: grid;
  --min-inline-size: 80px;
}

:host([orientation=horizontal]) {
  writing-mode: vertical-rl;
  --min-inline-size: 4em;
}

#bar-area {
    display: grid;
    grid-template-rows: 1fr auto;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    justify-items: center;
    align-items: flex-end;
}

#category-axis {
  grid-column: 1 / span var(--_bar-count);
  grid-row: 2;
  display: grid;
  grid-template-columns: subgrid;
  grid-auto-flow: column;
}

::slotted(ui-bar) {
    block-size: var(--bar-size, 0%);
    inline-size: min(75%, var(--min-inline-size));
    transition: block-size var(--animation-duration);
    background: #426cb3;
}

::slotted([slot=category]) { 
      display: grid;
      place-items: center;
      writing-mode: horizontal-tb;
}

</style>
<div id="bar-area" part="bar-area">
  <slot name="bar-area"></slot>
  <div id="category-axis" part="category-axis"><slot name="category"></slot></div>
</div>
`;

export function* UIBarChart({ $root, $host }) {
  $root.appendChild(template.content.cloneNode(true));
  const barArea = $root.querySelector('[name=bar-area]');
  const getValues = () => barArea.assignedElements().map(({ value }) => value);

  Object.defineProperties($host, {
    domainMin: {
      enumerable: true,
      get() {
        return $host.hasAttribute('domain-min')
          ? Number($host.getAttribute('domain-min'))
          : Math.min(...getValues());
      },
    },
    domainMax: {
      enumerable: true,
      get() {
        return $host.hasAttribute('domain-max')
          ? Number($host.getAttribute('domain-max'))
          : Math.max(...getValues());
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
