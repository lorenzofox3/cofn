const getAttributes = (el) =>
  Object.fromEntries(
    el.getAttributeNames().map((name) => [name, el.getAttribute(name)])
  );

export const component = (renderLoop, opts = {}) => {
  const Klass = class extends HTMLElement {
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
        if (this.firstElementChild) {
          this.firstElementChild.replaceWith(el);
        } else {
          this.appendChild(el);
        }
      }
    }
  };

  if (opts.observedAttributes) {
    Object.defineProperty(Klass, 'observedAttributes', {
      get() {
        return [...opts.observedAttributes];
      },
      configurable: true,
    });

    Klass.prototype.attributeChangedCallback = function (
      name,
      oldValue,
      newValue
    ) {
      if (oldValue !== newValue) {
        this.render();
      }
    };
  }

  return Klass;
};
