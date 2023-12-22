import { define } from '@cofn/core';
import { withView } from '../src/index.js';
export const nextTick = () => new Promise((resolve) => setTimeout(resolve, 0));

let compCount = 0;
export const fromView = (view) => {
  const tag = `view-test-${++compCount}`;
  define(tag, withView(view));
  return document.createElement(tag);
};
