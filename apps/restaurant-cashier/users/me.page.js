import { createElement } from '../utils/dom.js';

const template = createElement('template');

template.innerHTML = `<h1 tabindex="-1">Me</h1>
<details id="preferences" class="surface boxed" open>
  <summary autofocus>Preferences</summary>
  <div class="container">
    <label>
      <span>Theme</span>
      <button>dark mode</button>
    </label>
    <label>
      <span>Motion (animations)</span>
      <button>reduced</button>
    </label>
  </div>
</details>
`;

export const loadPage = async () => {
  return template.content.cloneNode(true);
};
