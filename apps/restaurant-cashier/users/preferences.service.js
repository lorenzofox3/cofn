import { createEventEmitter } from '../utils/events.service.js';
import { matchMedia } from '../utils/dom.js';

export const motionSettings = {
  default: 'default',
  reduced: 'reduced',
  normal: 'normal',
};

export const themeSettings = {
  default: 'default',
  light: 'light',
  dark: 'dark',
};

export const preferencesEvents = {
  PREFERENCES_CHANGED: 'preferences-changed',
};

const preferencesStorageKey = 'preferences';
const colorSchemeMedia = matchMedia('(prefers-color-scheme: dark)');
const reducedMotionMedia = matchMedia('(prefers-reduced-motion: reduce)');
export const createPreferencesService = ({ storageService }) => {
  colorSchemeMedia.addEventListener('change', mediaQueryChangeHandler);
  reducedMotionMedia.addEventListener('change', mediaQueryChangeHandler);

  let state = {
    theme: themeSettings.default,
    motion: motionSettings.default,
  };

  const service = createEventEmitter();
  const emit = () =>
    service.emit({ type: preferencesEvents.PREFERENCES_CHANGED });

  // init
  storageService.getItem(preferencesStorageKey).then((settings) => {
    if (settings) {
      state = JSON.parse(settings);
      emit();
    }
  });

  return Object.assign(service, {
    getState() {
      return structuredClone({
        theme: {
          value: state.theme,
          computed:
            state.theme !== themeSettings.default
              ? state.theme
              : fromMediaQueries().theme,
        },
        motion: {
          value: state.motion,
          computed:
            state.motion !== motionSettings.default
              ? state.motion
              : fromMediaQueries().motion,
        },
      });
    },
    changeTheme: withDispatch((value) => {
      state.theme = themeSettings[value] ?? state.theme;
    }),
    changeMotion: withDispatch((value) => {
      state.motion = motionSettings[value] ?? state.motion;
    }),
  });
  async function mediaQueryChangeHandler() {
    const storedSettings = await storageService.getItem(preferencesStorageKey);
    if (!storedSettings) {
      state = fromMediaQueries({
        colorSchemeMedia,
        reducedMotionMedia,
      });
      emit();
    }
  }

  function withDispatch(method) {
    return async (...args) => {
      await method(...args);
      emit();
      storageService.setItem(preferencesStorageKey, JSON.stringify(state));
    };
  }
};
function fromMediaQueries() {
  return {
    theme: colorSchemeMedia.matches ? themeSettings.dark : themeSettings.light,
    motion: reducedMotionMedia.matches
      ? motionSettings.reduced
      : motionSettings.normal,
  };
}
