export const counterDisplay = function* () {
  const el = document.createElement('span');

  while (true) {
    const {
      state: { counter },
    } = yield el;
    el.textContent = counter;
  }
};

export const actionButton = function* ({ actions, update }) {
  const button = document.createElement('button');
  let actionName;
  let clickCount = 0;
  button.addEventListener('click', () => {
    clickCount++;
    update(); // update local
    actions[actionName]();
  });

  while (true) {
    const {
      attributes: { action },
    } = yield button;
    actionName = action;
    button.textContent = action + `( clicks:${clickCount} )`;
  }
};
