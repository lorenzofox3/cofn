import { APIRootURL } from '../config.js';
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
