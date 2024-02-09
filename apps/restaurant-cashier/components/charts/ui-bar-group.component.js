import { createElement } from '../../utils/dom.js';

const template = createElement('template');
template.innerHTML = `
<style>
  :host {
      block-size: 100%;
      inline-size: 100%;
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: 1fr;
      align-items: end;
      justify-items: center;
  }
  
  :host([stack]) {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
}
  
  ::slotted(ui-bar) {
      block-size: var(--bar-size, 0%);
      inline-size: min(75%, 80px);
      transition: block-size var(--animation-duration);
      background: #426cb3;
  }
</style>
<slot name="bar-area"></slot>
`;

export function* UIBarGroup({ $host, $root }) {
  $host.setAttribute('slot', 'bar-area');
  $root.appendChild(template.content.cloneNode(true));
  const slot = $root.querySelector('[name=bar-area]');
  Object.defineProperties($host, {
    value: {
      enumerable: true,
      get() {
        const assignedBars = slot.assignedElements();
        return $host.hasAttribute('stack')
          ? assignedBars.reduce((total, { value }) => total + value, 0)
          : Math.max(...assignedBars.map(({ value }) => value));
      },
    },
  });
}
