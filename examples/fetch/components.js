import { withInjectables } from '../../src/index.js';
import { fetch } from './fetch.js';

const loader = document.createElement('span');
loader.textContent = 'loading...';

const error = document.createElement('p');
error.textContent = 'something wrong happened';

const contentTemplate = document.createElement('template');
contentTemplate.innerHTML = `<div>
    <p>welcome <span></span>. It is <time></time></p>
    <button>Refresh</button>
  </div>`;

const useFetch = withInjectables({ fetch });

const createResourceElement = ({ resource, loadResource }) => {
  const resourceNode = contentTemplate.content.cloneNode(true);
  resourceNode.querySelector('span').textContent = resource.name;
  resourceNode.querySelector('time').textContent = JSON.stringify(
    new Date(resource.timestamp)
  );
  resourceNode.querySelector('button').addEventListener('click', loadResource);

  return resourceNode;
};

export const resourceComponent = useFetch(function* ({ fetch, $el }) {
  let isLoading = true;
  let resource, error;

  setTimeout(loadResource);

  while (true) {
    if (isLoading) {
      yield loader;
      continue;
    }

    if (error) {
      yield error;
      continue;
    }

    yield createResourceElement({ resource, loadResource });
  }

  async function loadResource() {
    isLoading = true;
    error = resource = undefined;
    $el.render();
    try {
      resource = await fetch('foo');
    } catch (e) {
      error = e;
    } finally {
      isLoading = false;
      $el.render();
    }
  }
});
