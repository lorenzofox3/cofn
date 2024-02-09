import { createElement } from '../../utils/dom.js';
import { createProjection, round } from './util.js';

const template = createElement('template');
template.innerHTML = `<style>
:host {
  display: grid;
  --min-inline-size: 70px;
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
    const { attributes } = yield;
    const barsOrGroups = barArea.assignedElements();

    $host.style.setProperty('--_bar-count', barsOrGroups.length);

    const groups = barsOrGroups.filter(is('ui-bar-group'));

    const bars = barsOrGroups
      .flatMap((bar) => [bar, ...Array.from(bar.children)])
      .filter(is('ui-bar'));

    groups.forEach((bar) =>
      bar.toggleAttribute('stack', attributes.stack !== undefined),
    );

    const project = createProjection($host);

    bars.forEach((bar) => bar.setAttribute('size', round(project(bar.value))));
  }
}

const is =
  (expectedLocalName) =>
  ({ localName }) =>
    localName === expectedLocalName;
