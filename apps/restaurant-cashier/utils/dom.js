import { mapBind } from './objects.js';
import { identity } from './functions.js';

const bind = mapBind(identity);
const { createElement, querySelector, createRange, createTextNode } =
  bind(document);
const { matchMedia } = bind(window);

export {
  createElement,
  matchMedia,
  querySelector,
  createRange,
  createTextNode,
};
