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

export const resourceComponent = useFetch(function* ({ resource, $el }) {
  let userResource;
  fetchUser();

  while (true) {
    const input = yield;
    userResource = input.resources?.['/me'];
    render(template({ userResource, fetchUser }), $el);
  }

  function fetchUser() {
    return resource.fetch('/me');
  }
});
