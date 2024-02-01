import { compose } from '../utils/functions.js';
import { createTreeWalker } from '../utils/dom.js';
import { noop } from '../router/utils.js';
import { bind } from '../utils/objects.js';

export const UIListbox = function* ({ $host, $root }) {
  $host.setAttribute('tabindex', '0');
  $host.setAttribute('role', 'listbox');

  Object.defineProperties($host, {
    value: {
      enumerable: true,
      get() {
        return $host.selectedOptions.map(({ value }) => value);
      },
    },
    selectedOptions: {
      enumerable: true,
      get() {
        return Array.from(
          $host.querySelectorAll('[role=option][aria-selected=true]'),
        );
      },
    },
  });

  const treeWalker = createTreeWalker(
    $root,
    NodeFilter.SHOW_ELEMENT,
    traverseOptions,
  );

  const { nextNode, previousNode } = bind(treeWalker);
  const toggleOptionSection = compose([toggleSelection, findTarget]);
  const movePrevious = compose([makeFocus, previousNode]);
  const moveNext = compose([makeFocus, nextNode]);

  const keyMapHandler = {
    ['Enter']: toggleOptionSection,
    [' ']: compose([
      toggleOptionSection,
      (ev) => {
        ev.preventDefault(); // avoid scroll on space
        return ev;
      },
    ]),
    ['ArrowUp']: movePrevious,
    ['ArrowLeft']: movePrevious,
    ['ArrowDown']: moveNext,
    ['ArrowRight']: moveNext,
  };

  $host.addEventListener('focusin', compose([handleFocusin, findTarget]));
  $host.addEventListener('click', toggleOptionSection);
  $host.addEventListener('keydown', handleKeydown);

  function toggleSelection(option) {
    if (option.selected !== undefined) {
      option.selected = !option.selected;
      makeFocus(option);
      $host.dispatchEvent(
        new CustomEvent('selection-changed', {
          detail: {
            option,
          },
        }),
      );
    }
    Array.from($root.querySelectorAll('[role=option]')).forEach((option) => {
      option.setAttribute('tabindex', '-1');
    });
    $host.setAttribute(
      'tabindex',
      $host.selectedOptions.length > 0 ? '-1' : '0',
    );
    $host.selectedOptions[0]?.setAttribute('tabindex', '0');
  }

  function findTarget(ev) {
    return (
      ev.composedPath().find((el) => el.getAttribute?.('role') === 'option') ??
      ev.target
    );
  }

  function handleKeydown(ev) {
    const handler = keyMapHandler[ev.key] ?? noop;
    handler(ev);
  }

  function makeFocus(el) {
    el?.focus();
  }

  function handleFocusin(option) {
    $host.setAttribute('aria-activedescendant', option?.id ?? '');
    treeWalker.currentNode = option;
  }
};

export const UIListboxOption = function* ({ $host }) {
  let _value = $host.getAttribute('value');
  Object.defineProperties($host, {
    selected: {
      enumerable: true,
      get() {
        return $host.getAttribute('aria-selected') === 'true';
      },
      set(value) {
        $host.setAttribute('aria-selected', value);
      },
    },
    value: {
      enumerable: true,
      get() {
        return _value !== undefined ? _value : $host.textContent;
      },
      set(value) {
        _value = value;
      },
    },
  });
  $host.setAttribute('role', 'option');
  $host.setAttribute('tabindex', '-1');
  $host.setAttribute(
    'aria-selected',
    $host.getAttribute('aria-selected') ?? 'false',
  );
};

const traverseOptions = (node) =>
  node.getAttribute?.('role') === 'option'
    ? NodeFilter.FILTER_ACCEPT
    : NodeFilter.FILTER_SKIP;
