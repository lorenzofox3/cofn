import { createElement } from '../utils/dom.js';

const template = createElement('template');

template.innerHTML = `<h1 tabindex="-1">Me</h1>
<details id="preferences" class="surface boxed" open>
  <summary autofocus>Preferences</summary>
  <app-preferences>
    <fieldset aria-labelledby="theme-legend">
    <span id="theme-legend" class="legend">Theme</span>
    <div class="radio-group">
      <label>
        <input name="theme" value="default" type="radio"/>
        <span><ui-icon name="gear"></ui-icon>OS default</span>
      </label>
      <label>
        <input name="theme" value="light" type="radio"/>
        <span><ui-icon name="sun"></ui-icon>light</span>
      </label>
      <label>
        <input name="theme" value="dark" type="radio"/>
        <span><ui-icon name="moon"></ui-icon>dark</span>
      </label>
    </div>
    </fieldset>
    <fieldset aria-labelledby="motion-legend">
    <span id="motion-legend" class="legend">Motion</span>
    <div class="radio-group">
      <label>
        <input name="motion" value="default" type="radio"/>
        <span><ui-icon name="gear"></ui-icon>OS default</span>
      </label>
      <label>
        <input name="motion" value="reduced" type="radio"/>
        <span><ui-icon name="ban"></ui-icon>none</span>
      </label>
      <label>
        <input name="motion" value="normal" type="radio"/>
        <span><ui-icon name="activity"></ui-icon>normal</span>
      </label>
    </div>
    </fieldset>
  </app-preferences>
</details>
`;

export const loadPage = async () => {
  const node = template.content.cloneNode(true);

  node.querySelector('details').addEventListener('change', console.log);

  return node;
};
