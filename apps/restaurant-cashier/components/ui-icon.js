const template = document.createElement('template');
template.innerHTML = `
<style>
:host {
    display: inline-block;
}
svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
}
</style>
<svg>
    <use id="use" xlink:href=""></use>
</svg>
`;

const spriteURL = `../node_modules/bootstrap-icons/bootstrap-icons.svg`;

export const UIIcon = function* ({ $host, $root }) {
  $root.replaceChildren(template.content.cloneNode(true));
  $root.querySelector('svg').setAttribute('aria-hidden', 'true');
  while (true) {
    const iconName = $host.getAttribute('name');
    $root
      .getElementById('use')
      .setAttribute('xlink:href', `${spriteURL}#${iconName}`);
    yield;
  }
};
