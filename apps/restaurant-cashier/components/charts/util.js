import { compose } from '../../utils/functions.js';

const createScale =
  ({ domainMin, domainMax }) =>
  (value) =>
    (value - domainMin) / (domainMax - domainMin);

const greaterOrEqual = (min) => (value) => Math.max(min, value);

const lowerOrEqual = (max) => (value) => Math.min(max, value);

const asPercentage = (val) => Math.floor(val * 10000) / 100; // two significative decimals

export const createProjection = ({ domainMin, domainMax }) =>
  compose([
    asPercentage,
    // todo clamp could be done with css overflow clip
    lowerOrEqual(1),
    greaterOrEqual(0),
    createScale({ domainMin, domainMax }),
  ]);

export const twoDecimalOnly = (val) => Math.floor(val * 100) / 100;
