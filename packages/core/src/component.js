const defaultOptions = Object.freeze({
  observedAttributes: [],
  Klass: HTMLElement,
});
export const component = (renderLoop, opts = defaultOptions) => {
  const { observedAttributes = [], Klass = HTMLElement, shadow } = opts;
  return class extends Klass {
    #loop;
    #abortController;
    #updateStack = [];

    static get observedAttributes() {
      return [...observedAttributes];
    }

    constructor() {
      super();
      this.#abortController = new AbortController();
      const $host = this;
      const $root = shadow !== undefined ? $host.attachShadow(shadow) : $host;
      this.#loop = renderLoop.bind(this)({
        $host,
        $root,
        $signal: this.#abortController.signal,
      });
      this.render = this.render.bind(this);
      this.#loop.next();
    }

    connectedCallback() {
      this.render();
    }

    disconnectedCallback() {
      // we end the rendering loop only if the component is removed from de DOM. Sometimes it is just moved from one place to another one
      window.queueMicrotask(() => {
        if (this.isConnected === false) {
          this.#abortController.abort();
          this.#loop.return();
        }
      });
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue && this.isConnected) {
        this.render();
      }
    }

    render(update = {}) {
      const currentPendingUpdateCount = this.#updateStack.length;
      this.#updateStack.push(update);
      if (!currentPendingUpdateCount) {
        window.queueMicrotask(() => {
          const arg = {
            attributes: getAttributes(this),
            ...Object.assign(...this.#updateStack),
          };
          if (this.hasAttribute('debug')) {
            console.debug('rendering', arg);
          }
          this.#loop.next(arg);
          this.#updateStack.length = 0;
        });
      }
    }
  };
};

export const getAttributes = (el) =>
  Object.fromEntries(
    el.getAttributeNames().map((name) => [name, el.getAttribute(name)]),
  );
