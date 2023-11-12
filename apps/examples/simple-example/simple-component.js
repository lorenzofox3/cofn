import { withController } from '@cofn/controllers';
import { withView } from '@cofn/view';
const countController = ({ state }) => {
  state.count = 0;

  return {
    increment() {
      state.count += 1;
    },
  };
};

const withCountController = withController(countController);

const view = withView(({ controller, html }) => ({ state }) => {
  return html`
    <div>
      <p>Hello world</p>
      <span>${'toto'}</span>
      <span even=${state.count % 2 === 1}>${state.count}</span>
      <span>toto + ${state.count} + ${state.count} + woot</span>
      ${html`<p><span>${state.count}</span></p>`}
      <p>
        ${state.count % 3 === 0
          ? html`<span>c'est ${state.count}</span>`
          : html`<span>no node</span>`}
      </p>
      <button @click="${controller.increment}">Increment</button>
    </div>
  `;
});

export const simpleComponent = withCountController(view);
// export const simpleComponent = upgrade(view);
