import { withTemplate } from '../../src/index.js';

const withinSpan = withTemplate({ template: '<span></span>' });
const withinButton = withTemplate({ template: '<button></button>' });

export const counterDisplay = withinSpan(function* ({ node: el }) {
  while (true) {
    const {
      state: { counter },
    } = yield el;
    el.textContent = counter;
  }
});

export const actionButton = withinButton(function* ({
  actions,
  $el,
  node: button,
}) {
  let actionName;
  let clickCount = 0;

  button.addEventListener('click', () => {
    clickCount++;
    $el.render();
    actions[actionName]();
  });

  while (true) {
    const {
      attributes: { action },
    } = yield button;
    actionName = action;
    button.textContent = action + `( clicks:${clickCount} )`;
  }
});
