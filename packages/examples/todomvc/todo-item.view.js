export const TodoItemView = ({ html, $host }) => {
  const id = Number($host.getAttribute('data-id'));
  const handleChange = dispatch('todo-toggled');
  const handleClick = dispatch('todo-removed');

  return ({ attributes }) =>
    html` <label
        ><input
          @change="${handleChange}"
          type="checkbox"
          checked="${attributes.completed !== undefined}"
        />
        <slot></slot>
      </label>
      <button @click="${handleClick}">X</button>`;

  function dispatch(eventName) {
    return (ev) => {
      ev.stopPropagation();
      $host.dispatchEvent(
        new CustomEvent(eventName, {
          bubbles: true,
          detail: {
            id,
          },
        }),
      );
    };
  }
};
