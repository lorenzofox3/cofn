import { withBookListController } from './book-list.controller.js';

export const BookListComponent = withBookListController(function* ({
  controller,
  $host,
}) {
  const formEl = $host.querySelector('form');
  const submitEl = formEl.querySelector('[type=submit]');
  const targetEl = $host.querySelector('#' + $host.dataset.target);

  formEl.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const { value: query } = formEl.elements.namedItem('search');
    controller.search({ query });
  });

  while (true) {
    const { state } = yield;
    const { isLoading = false, books = [], error = '' } = state;
    submitEl.disabled = isLoading;
    targetEl.textContent = JSON.stringify(books);
  }
});
