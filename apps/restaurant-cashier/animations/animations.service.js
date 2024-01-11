import { animate, wait } from '../utils/dom.js';

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

export const createAnimationsService = () => {
  return {
    async removeElement(el) {
      return await Promise.all([
        animate(el, removeAnimation, animationConfiguration),
        wait(animationConfiguration.duration * 1.1),
      ]);
    },
  };
};
