import { valueSymbol, findOrCreateTemplateRecord } from './active-site.js';

const shouldUpdateActiveSite = ([updateFn, newValue]) =>
  !Object.is(updateFn[valueSymbol], newValue);

const zip = (array1, array2) =>
  array1.map((item, index) => [item, array2[index]]);

export const withView = (viewFactory) =>
  function* (deps) {
    const { $root, $signal } = deps;
    const templateCache = new Map();
    const view = viewFactory({
      ...deps,
      html: createHTML({ $signal, templateCache }),
    });

    const viewFn = typeof view === 'function' ? view : () => view;

    const record = viewFn(yield);
    $root.replaceChildren(record.content);
    delete record.content; // free memory

    try {
      while (true) {
        viewFn(yield);
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
