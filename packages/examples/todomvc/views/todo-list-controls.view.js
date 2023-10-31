import { getModelFromState } from '../todo.model.js';

export const todoListControlsView =
  ({ html }) =>
  ({ state }) => {
    const { toBeCompletedCount, hasAnyItem } = getModelFromState(state);
    return html`${hasAnyItem
      ? html`<p>
          ${toBeCompletedCount} item${toBeCompletedCount > 1 ? 's' : ''} left
        </p>`
      : null}`;
  };
