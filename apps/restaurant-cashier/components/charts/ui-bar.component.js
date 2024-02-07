export function* UIBar({ $host }) {
  $host.setAttribute('slot', 'bar-area');
  while (true) {
    const { attributes } = yield;
    $host.style.setProperty('--bar-size', `${attributes.size}%`);
  }
}
