import { withTemplate } from '../../src/index.js';

const withinSpan = withTemplate({ template: '<span></span>' });

export const display = withinSpan(function* ({ node: span }) {
  try {
    while (true) {
      const { attributes } = yield span;
      span.textContent = attributes.number;
    }
  } finally {
    console.log('unmounted');
  }
});
