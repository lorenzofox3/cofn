export function* UIBar({ $host }) {
  $host.setAttribute('slot', 'bar-area');
  Object.defineProperties($host, {
    value: {
      enumerable: true,
      get() {
        return Number($host.getAttribute('value') ?? '0');
      },
    },
  });
  while (true) {
    const { attributes } = yield;
    $host.style.setProperty('--bar-size', `${attributes.size}%`);
  }
}
