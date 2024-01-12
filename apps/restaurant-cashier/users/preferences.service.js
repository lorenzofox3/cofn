import { createEventEmitter } from '../utils/events.service.js';
import { matchMedia } from '../utils/dom.js';

export const motionSettings = {
  REDUCED: 'REDUCED',
  NORMAL: 'NORMAL',
};

export const themeSettings = {
  LIGHT: 'LIGHT',
  DARK: 'DARK',
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

  let state = fromMediaQueries();

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
      return structuredClone(state);
    },
    changeTheme: withDispatch((value) => {
      state.theme = themeSettings[value] ?? state.theme;
    }),
    changeMotion: withDispatch((value) => {
      state.motion = motionSettings[value] ?? state.motion;
    }),
  });
  async function mediaQueryChangeHandler() {
    if (!(await storageService.getItem(preferencesStorageKey))) {
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
    theme: colorSchemeMedia.matches ? themeSettings.DARK : themeSettings.LIGHT,
    motion: reducedMotionMedia.matches
      ? motionSettings.REDUCED
      : motionSettings.NORMAL,
  };
}
