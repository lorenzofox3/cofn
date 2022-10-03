import { html, render } from 'lit-html';
import { withFetch } from './with-fetch.js';
import { fetch } from './fetch.js';

const useFetch = withFetch({ fetch });

const template = ({ userResource, fetchUser }) =>
  userResource?.state === 'loaded'
    ? html`<p>
        welcome <span>${userResource.data.name}</span>. It is
        <time>${new Date(userResource.data.timestamp)}</time>.
        <button @click="${fetchUser}">Refresh</button>
      </p>`
    : html`<p>Loading</p>`;

// todo handle error;
export const resourceComponent = useFetch(function* ({ resource }) {
  let userResource;
  let el = document.createElement('div');

  const renderUser = ({ userResource, fetchUser }) =>
    render(template({ userResource, fetchUser }), el);

  // load on mount
  fetchUser();

  while (true) {
    const input = yield el;
    userResource = input.resources?.['/me'];
    renderUser({ userResource, fetchUser });
  }

  function fetchUser() {
    return resource.fetch('/me');
  }
});
