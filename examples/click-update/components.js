import { withTemplate } from '../../src';

const withinButton = withTemplate({ template: '<button></button>' });

export const magicButton = withinButton(function* ({ node: button, $el }) {
  let clickCount = 0;

  button.addEventListener('click', clickHandler);

  while (true) {
    const { attributes } = yield button;
    button.textContent = `${attributes.label} (${clickCount})`;
  }

  function clickHandler() {
    clickCount++;
    $el.render();
  }
});
