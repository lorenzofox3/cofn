import { createElement } from '../../utils/dom.js';

// todo we could just draw the style into the "light dom" css style sheet to avoid repetition
// but position and size are here part of the functional spec of the components, so we want to encapsulate it ... for now

const template = createElement('template');
template.innerHTML = `
<style>
  ::slotted(ui-bar) {
      block-size: var(--bar-size, 0%);
      inline-size: min(75%, 70px);
      transition: block-size var(--animation-duration);
      overflow: hidden;
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
