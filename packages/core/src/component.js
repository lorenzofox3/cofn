const defaultOptions = Object.freeze({
  observedAttributes: [],
  Klass: HTMLElement,
});
export const component = (renderLoop, opts = defaultOptions) => {
  const { observedAttributes = [], Klass = HTMLElement, shadow } = opts;
  return class extends Klass {
    #loop;
    #abortController;
    #pendingUpdate = false;

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
      if (!this.#pendingUpdate) {
        this.render();
      }
    }

    disconnectedCallback() {
      this.#pendingUpdate = true;
      // we end the rendering loop only if the component is removed from de dom. Sometimes it is just moved from one place to another one
      window.queueMicrotask(() => {
        this.#pendingUpdate = false;
        if (this.isConnected === false) {
          this.#abortController.abort();
          this.#loop.return();
        }
      });
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue && !this.#pendingUpdate) {
        this.#pendingUpdate = true;
        window.queueMicrotask(() => {
          this.#pendingUpdate = false;
          this.render();
        });
      }
    }

    render(update = {}) {
      this.#loop.next({
        attributes: getAttributes(this),
        ...update,
      });
    }
  };
};

export const getAttributes = (el) =>
  Object.fromEntries(
    el.getAttributeNames().map((name) => [name, el.getAttribute(name)]),
  );
