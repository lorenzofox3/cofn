import { bind } from './objects.js';
const {
  createElement,
  querySelector,
  createRange,
  createTextNode,
  createTreeWalker,
} = bind(document);
const { matchMedia } = bind(window);

export {
  createElement,
  matchMedia,
  querySelector,
  createRange,
  createTextNode,
  createTreeWalker,
};
