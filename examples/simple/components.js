export const display = function* () {
  try {
    const span = document.createElement('span');
    while (true) {
      const { attributes } = yield span;
      span.textContent = attributes.number;
    }
  } finally {
    console.log('unmounted');
  }
};
