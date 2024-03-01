import { withBookListController } from './book-list.controller.js';
import { getElements, html } from './view.js';

export const BookListComponent = withBookListController(function* ({
  controller,
  $host,
}) {
  const targetId = $host.dataset.target;
  const targetSelector = `#${targetId}`;
  const parse = getElements(['form', '[type=submit]', targetSelector]);
  const {
    form: formEl,
    '[type=submit]': submitEl,
    [targetSelector]: targetEl,
  } = parse($host);

  $host.setAttribute('aria-controls', targetId);
  formEl.addEventListener('submit', handleSubmit);

  while (true) {
    const { state } = yield;
    const { isLoading = false, books = [], error = '' } = state;
    submitEl.disabled = isLoading;
    targetEl.innerHTML = renderSearchResults({ books });
    targetEl.setAttribute('aria-busy', isLoading);
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    const { value: query } = formEl.elements.namedItem('search');
    controller.search({ query });
  }
});

const renderSearchResults = ({ books }) => {
  return books
    .map(({ authorName, firstPublishYear, title }) => {
      return html`<li>
        <article>
          <h2>${title}</h2>
          <div class="content">
            <span class="author">Written by ${authorName}</span>
            <span class="publication"
              >First published in ${firstPublishYear}</span
            >
          </div>
        </article>
      </li>`;
    })
    .join('');
};
