export const TodoItemView = ({ html, $host }) => {
  const id = Number($host.getAttribute('data-id'));
  const handleChange = dispatch('todo-toggled');
  const handleClick = dispatch('todo-removed');

  return ({ attributes }) =>
    html`<style>
        label {
          flex-grow: 1;
          display: flex;
          align-items: center;
          gap: 1em;
        }

        input:checked + span {
          text-decoration: line-through;
          opacity: 0.3;
        }

        #remove-button {
          color: #a80000;
          border-color: #a80000 !important;
        }
      </style>
      <label
        ><input
          part="checkbox"
          @change="${handleChange}"
          type="checkbox"
          .checked="${attributes.completed !== undefined}"
        />
        <span>
          <slot></slot>
        </span>
      </label>
      <button id="remove-button" part="button" @click="${handleClick}">
        X<span>Remove</span>
      </button>`;

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
