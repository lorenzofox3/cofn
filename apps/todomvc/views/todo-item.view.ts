import { ViewFactory } from '@cofn/view';

export const TodoItemView: ViewFactory = ({ html, $host }) => {
  const id = Number($host.getAttribute('data-id'));
  const handleChange = dispatch('todo-toggled');
  const handleClick = dispatch('todo-removed');

  return ({ attributes }) =>
    html`<style>
        :host {
          --_gap: var(--gap, 0.5em);
          display: flex;
          align-items: center;
          gap: var(--_gap);
        }

        input:checked + span {
          text-decoration: line-through;
          opacity: 0.3;
        }

        #remove-button {
          --color: var(--danger-color, red);
        }

        label {
          display: grid;
          flex-grow: 1;
          grid-template-columns: var(--checkbox-width) 1fr;
          align-items: center;
          gap: var(--_gap);
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
