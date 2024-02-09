import { createElement } from '../../utils/dom.js';

const template = createElement('template');
template.innerHTML = `
<style>
  :host {
      block-size: 100%;
      inline-size: 100%;
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

export function* UIBarStack({ $host, $root }) {
  $host.setAttribute('slot', 'bar-area');
  $root.appendChild(template.content.cloneNode(true));
  const slot = $root.querySelector('[name=bar-area]');
  Object.defineProperties($host, {
    value: {
      enumerable: true,
      get() {
        return slot
          .assignedElements()
          .reduce((total, { value }) => total + value, 0);
      },
    },
  });
}
