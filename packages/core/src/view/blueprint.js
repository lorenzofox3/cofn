import { traverseTree } from './tree.js';
import { createUpdateFn } from './update.js';

export const ACTIVE_SITE_POINTER = '__AS__';
export const activeSiteSymbol = Symbol('activeSite');

export const findOrCreateTemplateRecord = ({
  templateParts,
  interpolatedValues,
  templateCache,
  $signal,
}) => {
  const { template, ...blueprint } = buildBlueprint({
    templateParts,
    interpolatedValues,
  });
  if (!templateCache.has(blueprint.key)) {
    const fragment = createFragment(template);
    templateCache.set(blueprint.key, {
      [activeSiteSymbol]: true,
      ...blueprint,
      fragment,
      updateFns: createUpdateFns({
        templateCache,
        fragment,
        interpolatedValues: blueprint.isKeyed
          ? interpolatedValues.slice(1)
          : interpolatedValues,
        $signal,
      }),
    });
  }
  return templateCache.get(blueprint.key);
};
const buildBlueprint = ({ templateParts, interpolatedValues }) => {
  const [firstPart, ...rest] = templateParts;
  const isKeyed = firstPart === '' && rest?.[0].startsWith('::'); // if template is like "key::<li></li>"
  const actualFirstPart = isKeyed ? rest.shift().slice(2) : firstPart;
  const template =
    actualFirstPart + rest.map((part) => ACTIVE_SITE_POINTER + part).join('');
  return {
    isKeyed,
    key: isKeyed ? interpolatedValues[0] : template,
    template,
  };
};
const createFragment = (blueprint) => {
  const templateElement = document.createElement('template');
  templateElement.innerHTML = blueprint;
  return templateElement.content.cloneNode(true);
};

const createUpdateFns = ({
  fragment,
  interpolatedValues,
  templateCache,
  $signal,
}) =>
  traverseTree(fragment).map((node, index) =>
    createUpdateFn({
      node,
      initialValue: interpolatedValues[index],
      templateCache,
      $signal,
    }),
  );
