export const sumSpan = function* () {
  const span = document.createElement('span');
  while (true) {
    const { attributes } = yield span;
    const { a, b } = attributes;
    span.textContent = `${a} + ${b} = ${Number(a) + Number(b)}`;
  }
};
