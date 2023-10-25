import { once } from '../utils.js';
import { activeSiteSymbol } from './blueprint.js';
import { createRange } from './range.js';

export const valueSymbol = Symbol('value');
const createTextOrElementNodeUpdateFn = ({
  node,
  initialValue,
  templateCache,
}) => {
  const isDomNode =
    initialValue?.[activeSiteSymbol] === true || initialValue === null;
  const updateFn = isDomNode
    ? createUpdateDOMNode({ node, templateCache })
    : createUpdateTextContent({ node });
  const update = (value) => {
    const oldValue = update[valueSymbol];
    return updateFn(value, oldValue);
  };

  return updateFn;
};

const createUpdateList =
  ({ node }) =>
  (value, oldValue) => {
    // item with focus
    const activeElement = document.activeElement;

    const parentElement = oldValue || node.parentElement;
    parentElement.replaceChildren(...value.map(({ element }) => element));

    // restore focus
    if (activeElement.isConnected && document.activeElement !== activeElement) {
      activeElement.focus();
    }

    return parentElement;
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
}) =>
  once((value) => {
    // todo pass signal along
    ownerElement.addEventListener(attributeName.slice(1), value, { signal });
    ownerElement.removeAttribute(attributeName);
    return value;
  });

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
        ownerElement.setAttribute(attributeName, '');
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

export const createUpdateFn = ({
  node,
  initialValue,
  templateCache,
  $signal,
}) =>
  updateFunctionMap[node.nodeType]({
    node,
    initialValue,
    templateCache,
    $signal,
  });
