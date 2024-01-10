export const animate = (el, ...rest) =>
  new Promise((resolve) => {
    const animation = el.animate(...rest);
    animation.addEventListener('finish', resolve, { once: true });
  });

export const wait = (time) =>
  new Promise((resolve) => setTimeout(resolve, time));
