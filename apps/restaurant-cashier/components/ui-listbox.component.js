export const UIListbox = function* ({ $host }) {
  let activeDescendant;
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

  $host.addEventListener('click', (ev) => {
    const option = ev
      .composedPath()
      .find((el) => el.getAttribute?.('role') === 'option');
    if (option) {
      option.selected = !option.selected;
    }
  });

  $host.addEventListener('keydown', (ev) => {
    // todo
  });

  // no specific rendering
  while (true) {
    yield;
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
};
