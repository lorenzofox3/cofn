import { createRange } from './range.js';
import { traverseTree, ACTIVE_SITE_POINTER } from './tree.js';

export const valueSymbol = Symbol('value');

const activeSiteSymbol = Symbol('activeSite');

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
    const content = createContent({
      blueprint: template,
      isKeyed: blueprint.isKeyed,
    });
    templateCache.set(blueprint.key, {
      [activeSiteSymbol]: true,
      ...blueprint,
      content,
      updateFns: createUpdateFns({
        templateCache,
        content,
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
  const isKeyed = firstPart === '' && rest?.[0].startsWith('::'); // if template is like `${key}::<li></li>`
  const actualFirstPart = isKeyed ? rest.shift().slice(2) : firstPart;
  const template = (
    actualFirstPart + rest.map((part) => ACTIVE_SITE_POINTER + part).join('')
  ).trim();
  return {
    isKeyed,
    key: isKeyed ? interpolatedValues[0] : template,
    template,
  };
};
const createContent = ({ blueprint, isKeyed }) => {
  const templateElement = document.createElement('template');
  templateElement.innerHTML = blueprint;
  const fragment = templateElement.content.cloneNode(true);
  if (isKeyed && fragment.childElementCount > 1) {
    throw new Error('Keyed template can only have one root node');
  }
  return isKeyed ? fragment.children.item(0) : fragment;
};

const createUpdateFns = ({
  content,
  interpolatedValues,
  templateCache,
  $signal,
}) =>
  traverseTree(content).map((node, index) =>
    createUpdateFn({
      node,
      initialValue: interpolatedValues[index],
      templateCache,
      $signal,
    }),
  );

const createTextOrElementNodeUpdateFn = ({
  node,
  initialValue,
  templateCache,
}) => {
  const isElementLike =
    initialValue?.[activeSiteSymbol] === true ||
    initialValue === null ||
    Array.isArray(initialValue);

  const updateFn = isElementLike
    ? createUpdateDOMNode({ node, templateCache })
    : createUpdateTextContent({ node });
  const update = (value) => updateFn(value, update[valueSymbol]);

  return updateFn;
};

const createUpdateTextContent =
  ({ node }) =>
  (value) =>
    (node.textContent = value);

const createUpdateDOMNode = ({ node, templateCache }) => {
  const activeRange = createRange({ node, templateCache });
  return (value) => activeRange.replaceWith(value);
};

const createUpdateListener = ({
  node: { ownerElement, name: attributeName },
  $signal: signal,
}) => {
  const update = (value) => {
    const eventName = attributeName.slice(1);
    const currentListener = update[valueSymbol];
    if (currentListener) {
      ownerElement.removeEventListener(eventName, currentListener);
    }
    ownerElement.addEventListener(eventName, value, { signal });
    ownerElement.removeAttribute(attributeName);
    return value;
  };

  return update;
};
const createUpdateProperty =
  ({ node: { ownerElement, name: attributeName } }) =>
  (value) =>
    (ownerElement[attributeName] = value);

const createUpdateAttribute =
  ({ node: { ownerElement, name: attributeName } }) =>
  (value) => {
    if (typeof value === 'boolean') {
      if (value === false) {
        ownerElement.removeAttribute(attributeName);
      } else {
        ownerElement.setAttribute(attributeName, 'true');
      }
    } else {
      ownerElement.setAttribute(attributeName, value);
    }
    return value;
  };

const createAttributeNodeUpdateFn = ({ node, $signal }) => {
  const { name: attributeName } = node;

  if (attributeName.startsWith('@')) {
    return createUpdateListener({ node, $signal });
  }

  if (attributeName.startsWith('.')) {
    return createUpdateProperty({ node });
  }

  return createUpdateAttribute({ node });
};

const updateFunctionMap = {
  // Attr
  2: createAttributeNodeUpdateFn,
  // Text
  3: createTextOrElementNodeUpdateFn,
};

const createUpdateFn = ({ node, initialValue, templateCache, $signal }) =>
  updateFunctionMap[node.nodeType]({
    node,
    initialValue,
    templateCache,
    $signal,
  });
