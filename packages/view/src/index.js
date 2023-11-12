import { valueSymbol, findOrCreateTemplateRecord } from './active-site.js';

const shouldUpdateActiveSite = ([updateFn, newValue]) =>
  !Object.is(updateFn[valueSymbol], newValue);

const zip = (array1, array2) =>
  array1.map((item, index) => [item, array2[index]]);

export const withView = (viewFactory) =>
  function* (deps) {
    const { $root, $signal } = deps;
    const view = viewFactory({
      ...deps,
      html: createHTML({ $signal }),
    });

    const record = view(yield);
    $root.replaceChildren(record.content);
    delete record.content; // free memory

    while (true) {
      view(yield);
    }
  };

export const createHTML = ({ $signal }) => {
  const templateCache = new Map();

  $signal.addEventListener('abort', () => templateCache.clear(), {
    once: true,
  });

  return (templateParts, ...interpolatedValues) => {
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
};
