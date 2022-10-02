import { withTemplate } from '../../src';

const withinButton = withTemplate({ template: '<button></button>' });

export const magicButton = withinButton(function* ({ node: button, $el }) {
  let clickCount = 0;

  button.addEventListener('click', () => {
    clickCount++;
    $el.render();
  });

  while (true) {
    const { attributes } = yield button;
    button.textContent = `${attributes.label} (${clickCount})`;
  }
});
