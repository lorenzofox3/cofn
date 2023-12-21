import { Diagnostic } from './diagnostic.component.js';
import { TestResult } from './test-result.component.js';

customElements.define('zora-diagnostic', Diagnostic);
customElements.define('zora-test-result', TestResult);

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
          const el = (currentTestEl =
            document.createElement('zora-test-result'));
          rootEl.appendChild(el);
          el.description = data.description;
          break;
        }
        case 'ASSERTION': {
          currentTestEl.addAssertion(data);
          break;
        }
        case 'TEST_END': {
          currentTestEl.endsTest(data);
          break;
        }
      }
    },
  });
};
