import { once, zip } from './utils.js';

const ACTIVE_SITE_POINTER = '__AS__';
const valueSymbol = Symbol('value');
export const withView = (viewFactory) =>
  function* (deps) {
    const templateCache = new Map();
    const observer = new MutationObserver(
      removeDisconnectedNodesFromCache(templateCache),
    );

    try {
      const { $root, $signal } = deps;
      observer.observe($root, { childList: true, subtree: true });
      const view = viewFactory({
        ...deps,
        html: createHTML({ $signal, templateCache }),
      });

      const { element: content } = view(yield);
      $root.replaceChildren(content);

      while (true) {
        view(yield);
      }
    } finally {
      templateCache.clear();
      observer.disconnect();
    }
  };

export const createHTML =
  ({ $signal: signal, templateCache }) =>
  (templateParts, ...interpolatedValues) => {
    const templateRecord = findOrCreateTemplateRecord({
      blueprint: buildBlueprint({ templateParts, interpolatedValues }),
      templateCache,
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
  updateFn[valueSymbol] === undefined ||
  !Object.is(updateFn[valueSymbol], newValue);

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

function* traverseTree(treeWalker) {
  let { currentNode } = treeWalker;
  while (currentNode !== null) {
    yield* currentNode.nodeType === 1
      ? new Set(
          [...currentNode.attributes].filter((attr) =>
            attr.value?.includes(ACTIVE_SITE_POINTER),
          ),
        )
      : [currentNode];

    currentNode = treeWalker.nextNode();
  }
}

const findOrCreateTemplateRecord = ({ blueprint, templateCache }) => {
  if (!templateCache.has(blueprint.key)) {
    const element = createElement(blueprint.template);
    templateCache.set(blueprint.key, {
      ...blueprint,
      element,
      updateFns: createUpdateFns(element),
    });
  }
  return templateCache.get(blueprint.key);
};

const createTreeWalker = (root) =>
  document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
    {
      acceptNode(node) {
        // Element attributes
        if (node.nodeType === 1) {
          const hasMatchingAttribute = [...node.attributes].some((attr) =>
            attr.value?.includes(ACTIVE_SITE_POINTER),
          );
          return hasMatchingAttribute
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_SKIP;
        }
        // text
        if (node.nodeType === 3) {
          return node.textContent.includes(ACTIVE_SITE_POINTER)
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT;
        }

        return NodeFilter.FILTER_REJECT;
      },
    },
  );
const createElement = (blueprint) => {
  const templateElement = document.createElement('template');
  templateElement.innerHTML = blueprint;
  const fragment = templateElement.content.cloneNode(true);
  if (fragment.childElementCount > 1) {
    // todo better reporting
    throw new Error('"html" template can only have one root element');
  }
  return fragment.children.item(0);
};
const prepareNode = (node) => {
  if (node.nodeType === 3) {
    return node.textContent === ACTIVE_SITE_POINTER
      ? node
      : [...splitTextNode(node)];
  }
  return node;
};

// we drop from the cache entries which were disconnected from the root node
const removeDisconnectedNodesFromCache = (templateCache) => (mutations) => {
  const disconnectedElements = mutations.flatMap((mutation) =>
    Array.from(mutation.removedNodes).filter(
      ({ isConnected }) => isConnected === false,
    ),
  );

  const toDrop = Array.from(templateCache.entries())
    .filter(([_key, value]) => disconnectedElements.includes(value.element))
    .map(([key]) => key);

  toDrop.forEach((toDropElement) => templateCache.delete(toDropElement));
};

function* splitTextNode(node) {
  if (!node.textContent.includes(ACTIVE_SITE_POINTER)) {
    return;
  }
  const activeSiteIndex = node.textContent.indexOf(ACTIVE_SITE_POINTER);
  const next = node.splitText(activeSiteIndex + ACTIVE_SITE_POINTER.length);
  const activeSite = document.createTextNode('');
  const range = new Range();
  range.setStart(node, activeSiteIndex);
  range.setEndAfter(node);
  range.deleteContents();
  range.insertNode(activeSite);
  yield activeSite;
  yield* splitTextNode(next);
}

const createUpdateFns = (element) =>
  [...traverseTree(createTreeWalker(element))]
    .flatMap(prepareNode)
    .map(createUpdateFn);

const createUpdateFn = (node) => {
  const updateFunctionMap = {
    // Attr
    2: createAttributeNodeUpdateFn,
    // Text
    3: createTextOrElementNodeUpdateFn,
  };
  return updateFunctionMap[node.nodeType](node);
};

const createTextOrElementNodeUpdateFn = (node) => {
  const updateTextContent = createUpdateTextContent(node);
  const updateElementContent = createUpdateDOMNode(node);
  const updateList = createUpdateList(node);
  const updateFn = (value) => {
    const isDomNode = value?.element?.nodeName || value === undefined;
    const oldValue = updateFn[valueSymbol];
    if (Array.isArray(value)) {
      return updateList(value, oldValue);
    }

    return isDomNode
      ? updateElementContent(value, oldValue)
      : updateTextContent(value);
  };

  return updateFn;
};

const createUpdateList = (node) => (value, oldValue) => {
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

const createUpdateTextContent = (node) => (value) => (node.textContent = value);

const createUpdateDOMNode = (node) => (value, oldValue) => {
  const newNode =
    value === undefined ? document.createTextNode('') : value.element;
  const oldNode = oldValue ?? node;
  oldNode.replaceWith(newNode);
  return newNode;
};

const createUpdateListener = ({ ownerElement, name: attributeName }) =>
  once((value) => {
    // todo pass signal along
    ownerElement.addEventListener(attributeName.slice(1), value);
    ownerElement.removeAttribute(attributeName);
    return value;
  });

const createUpdateProperty =
  ({ ownerElement, name: attributeName }) =>
  (value) =>
    (ownerElement[attributeName] = value);

const createUpdateAttribute =
  ({ ownerElement, name: attributeName }) =>
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

const createAttributeNodeUpdateFn = (node) => {
  const { name: attributeName } = node;

  if (attributeName.startsWith('@')) {
    return createUpdateListener(node);
  }

  if (attributeName.startsWith('.')) {
    return createUpdateProperty(node);
  }

  return createUpdateAttribute(node);
};
