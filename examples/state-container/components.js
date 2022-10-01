export const counterDisplay = function* () {
  const el = document.createElement('span');

  while (true) {
    const received = yield el;
    console.log(received);
    const {
      state: { counter },
    } = received;
    el.textContent = counter;
  }
};

export const actionButton = function* ({ actions }) {
  const button = document.createElement('button');
  let actionName;
  button.addEventListener('click', () => {
    actions[actionName]();
  });

  while (true) {
    const {
      attributes: { action },
    } = yield button;
    actionName = action;
    button.textContent = action;
  }
};
