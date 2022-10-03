import { html, render as litRender } from 'lit-html';

export const template = ({ userResource, fetchUser }) =>
  userResource?.state === 'loaded'
    ? html`<p>
        welcome <span>${userResource.data.name}</span>. It is
        <time>${new Date(userResource.data.timestamp)}</time>.
        <button @click="${fetchUser}">Refresh</button>
      </p>`
    : html`<p>Loading</p>`;

export const render = ({ template, el }) => litRender(template, el);
