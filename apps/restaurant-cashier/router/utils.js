import { noop } from '../utils/functions.js';

export function composeStack(fns = []) {
  const [first, ...rest] = fns;

  if (first === void 0) {
    return noop;
  }

  const next = composeStack(rest);

  return async (ctx) => first(ctx, () => next(ctx));
}

export function createContext({ state, router, routeDef }) {
  return { state, router, routeDef };
}
