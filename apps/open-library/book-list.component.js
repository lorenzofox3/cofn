import { withBookListController } from './book-list.controller.js';

export const BookListComponent = withBookListController(function* ({
  controller,
  $host,
}) {
  const formEl = $host.querySelector('form');
  const submitEl = formEl.querySelector('[type=submit]');
  const target = $host.dataset.target;
  const targetEl = $host.querySelector('#' + target);

  $host.setAttribute('aria-controls', target);
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

// todo avoid xss
const renderSearchResults = ({ books }) => {
  return books
    .map(({ authorName, firstPublishYear, title }) => {
      return `<li>
        <article>
        <h2>${title}</h2>
        <div class="author">Written by ${authorName}</div>
        <div class="publication">First published in ${firstPublishYear}</div>
        </article>
      </li>`;
    })
    .join('');
};
