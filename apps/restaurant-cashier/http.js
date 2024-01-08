import { APIRootURL } from './config.js';

export const createHTTPFacade = () => {
  return {
    fetch: async (request) => {
      // const token = await auth.getToken();
      const { headers = {}, url, body, ...rest } = request;
      return http(url, {
        ...rest,
        ...(body ? { body: JSON.stringify(body) } : {}),
        headers: {
          // Authorization: ['Bearer', token].join(' '),
          ...(body ? { ['Content-Type']: 'application/json' } : {}),
          ...headers,
        },
      });
    },
  };
};

export const http = async (path, options = {}) => {
  const { query, ...rest } = options;
  const url = new URL(path, APIRootURL);
  if (query) {
    url.search = new URLSearchParams(query).toString();
  }
  const result = await fetch(url, rest);

  if (!result.ok) {
    throw new Error('http error');
  }

  const { headers } = result;

  const contentTypeHeader = headers.get('Content-Type');

  if (contentTypeHeader?.includes('application/json')) {
    return result.json();
  }

  return result;
};
