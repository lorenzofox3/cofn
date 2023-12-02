import { getModelFromState } from '../todo.model.ts';
import { ViewFactory } from '@cofn/view';
import { TodoService, TodoServiceState } from '../todo.service.ts';

export const todoListControlsView: ViewFactory<
  { todoService: TodoService },
  { state: TodoServiceState }
> = ({ html, todoService }) => {
  const handleChange = ({ target }) =>
    todoService.updateFilter({ filter: target.value });

  return ({ state }) => {
    const {
      toBeCompletedCount,
      areAllCompleted,
      hasAnyCompleted,
      hasAnyItem,
      filter,
    } = getModelFromState(state);
    return html`${hasAnyItem
      ? html`<div class="container">
          <fieldset @change="${handleChange}">
            <legend>What tasks do you want to see ?</legend>
            <div>
              <label>
                All
                <input
                  checked="${filter === 'all'}"
                  type="radio"
                  name="filter"
                  value="all"
                />
              </label>
              <label>
                Completed
                <input
                  checked="${filter === 'completed'}"
                  type="radio"
                  name="filter"
                  value="completed"
                />
              </label>
              <label>
                To be done
                <input
                  checked="${filter === 'to-be-done'}"
                  type="radio"
                  name="filter"
                  value="to-be-done"
                />
              </label>
            </div>
          </fieldset>
          <p>
            ${toBeCompletedCount} item${toBeCompletedCount > 1 ? 's' : ''} left
          </p>
          <label id="toggle-all">
            <input
              .checked="${areAllCompleted}"
              type="checkbox"
              @click="${todoService.toggleAll}"
            /><span>All</span>
          </label>
          ${hasAnyCompleted
            ? html`<button
                id="clear-completed"
                @click="${todoService.clearCompleted}"
              >
                Clear completed
              </button>`
            : null}
        </div>`
      : null}`;
  };
};
