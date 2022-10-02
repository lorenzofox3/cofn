import { withTemplate } from '../../src/index.js';

export const display = withTemplate({ template: '<span></span>' })(function* ({
  node: span,
}) {
  try {
    while (true) {
      const { attributes } = yield span;
      span.textContent = attributes.number;
    }
  } finally {
    console.log('unmounted');
  }
});
