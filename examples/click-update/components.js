export const magicButton = function* ({ update }) {
  let clickCount = 0;
  const button = document.createElement('button');

  button.addEventListener('click', () => {
    clickCount++;
    update();
  });

  while (true) {
    const { attributes } = yield button;
    button.textContent = `${attributes.label} (${clickCount})`;
  }
};
