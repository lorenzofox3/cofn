import { motionSettings, themeSettings } from './preferences.service.js';

export const PreferencesComponent = ({ html, preferencesService }) => {
  const handleThemeChange = ({ target: { value } }) =>
    preferencesService.changeTheme(value);
  const handleMotionChange = ({ target: { value } }) =>
    preferencesService.changeMotion(value);

  return ({ motion, theme }) => {
    const { value: motionValue } = motion;
    const { value: themeValue } = theme;
    return html` <fieldset
        @change="${handleThemeChange}"
        aria-labelledby="theme-legend"
      >
        <span id="theme-legend" class="legend">Theme</span>
        <div class="radio-group">
          <label>
            <input
              checked="${themeValue === themeSettings.default}"
              name="theme"
              value="default"
              type="radio"
            />
            <span><ui-icon name="gear"></ui-icon>OS default</span>
          </label>
          <label>
            <input
              checked="${themeValue === themeSettings.light}"
              name="theme"
              value="light"
              type="radio"
            />
            <span><ui-icon name="sun"></ui-icon>light</span>
          </label>
          <label>
            <input
              checked="${themeValue === themeSettings.dark}"
              name="theme"
              value="dark"
              type="radio"
            />
            <span><ui-icon name="moon"></ui-icon>dark</span>
          </label>
        </div>
      </fieldset>
      <fieldset @change="${handleMotionChange}" aria-labelledby="motion-legend">
        <span id="motion-legend" class="legend">Motion</span>
        <div class="radio-group">
          <label>
            <input
              checked="${motionValue === motionSettings.default}"
              name="motion"
              value="default"
              type="radio"
            />
            <span><ui-icon name="gear"></ui-icon>OS default</span>
          </label>
          <label>
            <input
              checked="${motionValue === motionSettings.reduced}"
              name="motion"
              value="reduced"
              type="radio"
            />
            <span><ui-icon name="ban"></ui-icon>none</span>
          </label>
          <label>
            <input
              checked="${motionValue === motionSettings.normal}"
              name="motion"
              value="normal"
              type="radio"
            />
            <span><ui-icon name="activity"></ui-icon>normal</span>
          </label>
        </div>
      </fieldset>`;
  };
};
