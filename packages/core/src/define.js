import { component } from './component.js';

export const define = (tag, coroutine, opts = {}) => {
  if (!customElements.get(tag)) {
    customElements.define(
      tag,
      component(coroutine, {
        observedAttributes: opts.observedAttributes,
        Klass: classElementMap[opts?.extends] ?? HTMLElement,
        ...opts,
      }),
      opts,
    );
  }
};

const classElementMap = {
  label: HTMLLabelElement,
  button: HTMLButtonElement,
  form: HTMLFormElement,
  li: HTMLLIElement,
  ul: HTMLUListElement,
  input: HTMLInputElement,
  p: HTMLParagraphElement,
  a: HTMLAnchorElement,
  body: HTMLBodyElement,
};
