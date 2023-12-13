const template = document.createElement('template');
template.innerHTML = `
<li></li>
`;

const createTestElement = ({ data }) => {
  const container = template.content.cloneNode(true);
  container.querySelector('li').textContent = data.description;
  return container.firstElementChild;
};

export const createHTMLReporter = ({ element }) => {
  const rootEl = element || document.querySelector('body');
  let currentTestEl;
  return new WritableStream({
    start() {
      rootEl.replaceChildren();
    },
    write(message) {
      const { type, data } = message;
      switch (type) {
        case 'TEST_START': {
          const el = (currentTestEl = createTestElement({ data }));
          rootEl.appendChild(el);
          break;
        }
        case 'ASSERTION': {
          currentTestEl.classList.add(data.pass === true ? 'success' : 'error');
          break;
        }
      }
    },
  });
};
