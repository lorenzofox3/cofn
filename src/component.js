const getAttributes = (el) =>
  Object.fromEntries(
    el.getAttributeNames().map((name) => [name, el.getAttribute(name)])
  );

const withObservedAttributes = ({ Klass, observedAttributes }) => {
  Object.defineProperty(Klass, 'observedAttributes', {
    get() {
      return [...observedAttributes];
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

  return Klass;
};

export const component = (renderLoop, opts = {}) => {
  const Klass = class extends HTMLElement {
    #loop;
    #root;

    constructor() {
      super();
      this.#root = opts.shadow ? this.attachShadow(opts.shadow) : this;
      this.#loop = renderLoop({
        $el: this,
      });
      this.render = this.render.bind(this);
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

      const firstChild = this.#root.firstChild;

      if (firstChild !== el) {
        if (firstChild) {
          firstChild.replaceWith(el);
        } else {
          this.#root.appendChild(el);
        }
      }
    }
  };
  return opts.observedAttributes
    ? withObservedAttributes({ Klass, ...opts })
    : Klass;
};
