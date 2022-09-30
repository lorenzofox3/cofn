const getAttributes = (el) =>
  Object.fromEntries(
    el.getAttributeNames().map((name) => [name, el.getAttribute(name)])
  );

export const component = (renderLoop) =>
  class extends HTMLElement {
    #loop;

    constructor() {
      super();
      this.#loop = renderLoop({
        update: (updateNs = {}) => {
          this.render(updateNs);
        },
      });
      this.#loop.next();
      this.render();
    }

    disconnectedCallback() {
      this.#loop.return();
    }

    render(updateNs = {}) {
      const { value: el } = this.#loop.next({
        ...updateNs,
        attributes: getAttributes(this),
      });

      if (this.firstElementChild !== el) {
        this.appendChild(el);
      }
    }
  };
