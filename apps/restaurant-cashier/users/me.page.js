import { createElement } from '../utils/dom.js';
import { createPreferencesController } from './preferences.controller.js';
import { withView } from '@cofn/view';
import { PreferencesComponent } from './preferences.component.js';

const template = createElement('template');

template.innerHTML = `<h1 tabindex="-1">My account</h1>
<details id="preferences" class="surface boxed" open>
  <summary>UI Preferences</summary>
  <app-preferences></app-preferences>
</details>
`;

export const loadPage = async ({ define, preferencesService }) => {
  const withPreferencesController = createPreferencesController({
    preferencesService,
  });
  define(
    'app-preferences',
    withPreferencesController(withView(PreferencesComponent)),
  );

  return {
    title: 'Settings',
    content: template.content.cloneNode(true),
  };
};
