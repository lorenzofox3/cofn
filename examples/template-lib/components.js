import { withFetch } from './with-fetch.js';
import { fetch } from './fetch.js';
// import { template, render } from './view-lit.js';
import { template, render } from './view-handlebars.js';

const useFetch = withFetch({ fetch });

export const resourceComponent = useFetch(function* ({ resource, $el }) {
  let userResource;

  // on mount
  fetchUser();

  while (true) {
    const input = yield;
    userResource = input.resources?.['/me'];
    render({ template: template({ userResource, fetchUser }), el: $el });
  }

  function fetchUser() {
    return resource.fetch('/me');
  }
});
