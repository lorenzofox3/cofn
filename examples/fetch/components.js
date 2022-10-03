import { withFetch } from './with-fetch.js';
import { fetch } from './fetch.js';

// TEMPLATES
const loader = document.createElement('span');
loader.textContent = 'loading...';

const error = document.createElement('p');
error.textContent = 'something wrong happened';

const contentTemplate = document.createElement('template');
contentTemplate.innerHTML = `<div>
    <p>welcome <span></span>. It is <time></time></p>
    <button>Refresh</button>
  </div>`;

const createUser = ({ user, fetchUser }) => {
  const resourceNode = contentTemplate.content.cloneNode(true);
  resourceNode.querySelector('span').textContent = user.name;
  resourceNode.querySelector('time').textContent = JSON.stringify(
    new Date(user.timestamp)
  );
  resourceNode.querySelector('button').addEventListener('click', fetchUser);

  return resourceNode;
};

// COMPONENT
const useFetch = withFetch({ fetch });

export const resourceComponent = useFetch(function* ({ resource }) {
  let remoteResource;
  let el = loader;

  const fetchUser = () => resource.fetch('/me');

  // load on mount
  fetchUser();

  while (true) {
    const input = yield el;

    remoteResource = input.resources?.['/me'];
    el =
      remoteResource?.state === 'loaded'
        ? createUser({ user: remoteResource.data, fetchUser })
        : loader;
  }
});
