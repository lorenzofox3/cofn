import { wait } from './functions.js';
import {
  motionSettings,
  preferencesEvents,
} from '../users/preferences.service.js';

const removeAnimation = [
  {
    opacity: 1,
    transform: 'scaleX(1) scaleY(1)',
  },
  {
    opacity: 0,
    transform: 'scaleX(0) scaleY(0)',
  },
];

const animationConfiguration = {
  duration: 200,
  iterations: 1,
  fill: 'forwards',
};

export const createAnimationsService = ({ preferencesService }) => {
  preferencesService.on(preferencesEvents.PREFERENCES_CHANGED, () => {
    animationConfiguration.duration =
      preferencesService.getState().motion === motionSettings.REDUCED ? 0 : 200;

    console.log(animationConfiguration);
  });

  return {
    async removeElement(el) {
      return await Promise.all([
        animate(el, removeAnimation, animationConfiguration),
        wait(animationConfiguration.duration * 1.1),
      ]);
    },
  };
};
const animate = (el, ...rest) =>
  new Promise((resolve) => {
    const animation = el.animate(...rest);
    animation.addEventListener('finish', resolve, { once: true });
  });
