import { withTemplate } from '../../src';

export const sumSpan = withTemplate({ template: '<span></span>' })(function* ({
  node: span,
}) {
  while (true) {
    const { attributes } = yield span;
    const { a, b } = attributes;
    span.textContent = `${a} + ${b} = ${Number(a) + Number(b)}`;
  }
});
