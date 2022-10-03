import { withTemplate } from '../../src';

const withinSpan = withTemplate({ template: '<span></span>' });

export const sumSpan = withinSpan(function* ({ node: span }) {
  while (true) {
    const { attributes } = yield span;
    const { a, b } = attributes;
    span.textContent = `${a} + ${b} = ${Number(a) + Number(b)}`;
  }
});
