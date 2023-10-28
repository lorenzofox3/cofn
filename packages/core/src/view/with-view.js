import { zip } from '../utils.js';
import { valueSymbol, findOrCreateTemplateRecord } from './active-site.js';

export const withView = (viewFactory) =>
  function* (deps) {
    const templateCache = new Map();

    const { $root, $signal } = deps;
    const view = viewFactory({
      ...deps,
      html: createHTML({ $signal, templateCache }),
    });

    const record = view(yield);
    $root.replaceChildren(record.content);
    delete record.content; // free memory

    try {
      while (true) {
        console.log(templateCache);
        view(yield);
      }
    } finally {
      templateCache.clear();
    }
  };

export const createHTML =
  ({ $signal, templateCache }) =>
  (templateParts, ...interpolatedValues) => {
    const templateRecord = findOrCreateTemplateRecord({
      templateParts,
      interpolatedValues,
      templateCache,
      $signal,
    });

    const actualValues = templateRecord.isKeyed
      ? interpolatedValues.slice(1) // first value is used for the key
      : interpolatedValues;

    const toUpdate = zip(templateRecord.updateFns, actualValues).filter(
      shouldUpdateActiveSite,
    );

    toUpdate.forEach(([updateFn, value]) => {
      updateFn[valueSymbol] = updateFn(value);
    });

    return templateRecord;
  };
const shouldUpdateActiveSite = ([updateFn, newValue]) =>
  !Object.is(updateFn[valueSymbol], newValue);
