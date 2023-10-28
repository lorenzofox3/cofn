import { ACTIVE_SITE_POINTER } from './active-site.js';

export const traverseTree = (templateElement) =>
  [..._traverseTree(createTreeWalker(templateElement))].flatMap(prepareNode);

const createTreeWalker = (fragment) =>
  document.createTreeWalker(
    fragment,
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

function* _traverseTree(treeWalker) {
  let { currentNode } = treeWalker;
  debugger;
  currentNode =
    currentNode.nodeType === 11 ? treeWalker.nextNode() : currentNode; // if a document fragment we "enter" the fragment
  while (currentNode) {
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

const prepareNode = (node) => {
  if (node.nodeType === 3) {
    return node.textContent === ACTIVE_SITE_POINTER
      ? node
      : [...splitTextNode(node)];
  }
  return node;
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
