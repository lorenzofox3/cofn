import { define } from '@cofn/core';
export const nextTick = () => new Promise((resolve) => setTimeout(resolve, 0));

let compCount = 0;
