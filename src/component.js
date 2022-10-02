const getAttributes = (el) =>
  Object.fromEntries(
    el.getAttributeNames().map((name) => [name, el.getAttribute(name)])
  );

export const component = (renderLoop, opts = {}) => {
  const Klass = class extends HTMLElement {
    #loop;
    #root;

    constructor() {
      super();
      if (opts.shadow) {
        this.attachShadow(opts.shadow);
      }
      this.#root = opts.shadow?.mode === 'open' ? this.shadowRoot : this;
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

      const firstElementChild = this.#root.firstElementChild;

      if (firstElementChild !== el) {
        if (firstElementChild) {
          firstElementChild.replaceWith(el);
        } else {
          this.#root.appendChild(el);
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
