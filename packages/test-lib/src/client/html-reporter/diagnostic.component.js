const prettyPrint = (value) => JSON.stringify(value, null, 2);

const diagnosticTemplate = document.createElement('template');
diagnosticTemplate.innerHTML = `
<details open>
  <summary>
    <span>
      <span class="description"></span><br/>
      <span>at <a class="location"></a></span>
    </span>
</summary>
<div class="comparison-container">
  <figure>
    <figcatpion>actual</figcatpion>
    <pre></pre>
  </figure>
  <figure>
    <figcatpion>expected</figcatpion>
    <pre></pre>
  </figure>
</div>
</details>
`;
export class Diagnostic extends HTMLElement {
  #_diagnostic;

  get diagnostic() {
    return this.#_diagnostic;
  }

  set diagnostic(value) {
    this.#_diagnostic = value;
    this.render();
  }

  connectedCallback() {
    this.replaceChildren(diagnosticTemplate.content.cloneNode(true));
  }

  render() {
    if (!this.#_diagnostic) {
      return;
    }

    const { at, operator, description, expected, actual } = this.#_diagnostic;

    this.querySelector(
      '.description',
    ).textContent = `[${operator}] ${description}`;

    const locationElement = this.querySelector('.location');
    const locationURL = new URL(at);
    const [_, row, column] = locationURL.search.split(':');
    locationElement.textContent = `${locationURL.pathname}:${row}:${column}`;
    locationElement.setAttribute('href', at);

    const [actualEl, expectedEl] = this.querySelectorAll('pre');
    actualEl.textContent = prettyPrint(actual);
    expectedEl.textContent = prettyPrint(expected);
  }
}
