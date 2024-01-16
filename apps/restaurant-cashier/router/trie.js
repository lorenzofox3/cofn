export const createTrie = () => {
  const root = {};
  return {
    insert(key) {
      const segments = getSegments(key);
      return insert({ segments });
    },
    search(value) {
      const segments = getSegments(value);
      const searchResult = search({
        segments,
      });
      const match = getSegments(searchResult?.path ?? '').join('/');
      return {
        ...(searchResult ? searchResult : {}),
        match,
      };
    },
  };

  function insert({ node = root, segments = [] } = {}) {
    if (segments.length === 0) {
      return;
    }

    const current = segments.shift();

    if (!node[current]) {
      node[current] = {};
    }

    return insert({ node: node[current], segments });
  }

  function search({ node = root, segments = [], path = '', params = {} }) {
    const current = segments.shift();

    if (!current) {
      return { path, params };
    }

    const withParameterKey = Object.keys(node).find((key) =>
      key.startsWith(':'),
    );

    if (!node[current] && !withParameterKey) {
      return undefined;
    }

    return search({
      node: node[current] || node[withParameterKey],
      segments,
      path: `${path}/${node[current] ? current : withParameterKey}`,
      params: {
        ...params,
        ...(withParameterKey ? { [withParameterKey.slice(1)]: current } : {}),
      },
    });
  }

  function getSegments(path) {
    return path.split('/').filter(Boolean);
  }
};
