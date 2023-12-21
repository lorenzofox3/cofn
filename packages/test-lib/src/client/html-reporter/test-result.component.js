const TestResultTemplate = document.createElement('template');
TestResultTemplate.innerHTML = `
<header>
<div aria-hidden="true" class="icon-container">
  <svg class="icon-failure" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
</svg>
<svg class="icon-success" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
  <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
</svg>
</div>
<h2></h2>
<time></time>
</header>
<section></section>
`;

export class TestResult extends HTMLElement {
  static get observedAttributes() {
    return ['description'];
  }

  #_runTime = undefined;
  #_assertions = [];

  get runTime() {
    return this.#_runTime !== undefined ? Number(this.#_runTime) : undefined;
  }

  get isPassing() {
    return this.#_assertions.every(({ pass }) => pass === true);
  }

  get description() {
    return this.hasAttribute('description')
      ? this.getAttribute('description')
      : undefined;
  }

  set description(value) {
    this.setAttribute('description', String(value));
  }

  connectedCallback() {
    this.replaceChildren(TestResultTemplate.content.cloneNode(true));
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }

    switch (name) {
      case 'description': {
        this.querySelector('h2').textContent = newValue;
        break;
      }
    }
  }

  endsTest({ executionTime }) {
    this.#_runTime = executionTime;
    this.querySelector('time').textContent = `${executionTime}ms`;
    this.classList.add(this.isPassing ? 'success' : 'failure');
  }

  addAssertion(assertion) {
    this.#_assertions.push(assertion);
    if (assertion.pass === false) {
      const diagnosticEl = document.createElement('zora-diagnostic');
      this.querySelector('section').append(diagnosticEl);
      diagnosticEl.diagnostic = assertion;
    }
  }
}
