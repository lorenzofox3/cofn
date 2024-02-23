const APIRootURL = 'https://openlibrary.org/';
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

  return result.json();
};

export const createSearchService = () => {
  return {
    async search({ query: q }) {
      return http('search.json', {
        query: {
          q,
          limit: 5,
          fields: ['author_name', 'first_publish_year', 'title'],
          lang: 'en',
          language: 'eng',
        },
      });
    },
  };
};

export const searchService = createSearchService();
