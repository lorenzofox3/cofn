import { mapBind } from './objects.js';

const wrapAsync =
  (fn) =>
  async (...args) =>
    fn(...args);

const { getItem, setItem, removeItem } = mapBind(wrapAsync, localStorage);

export const createStorageService = () => {
  return {
    getItem,
    setItem,
    removeItem,
  };
};
