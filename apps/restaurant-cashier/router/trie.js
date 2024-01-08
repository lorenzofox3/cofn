export const createTrie = () => {
  const root = {};
  return {
    insert(key) {
      const segments = getSegments(key);
      return insert({ segments });
    },
    search(value) {
      const segments = getSegments(value);
      const match = getSegments(
        search({
          segments,
        })
      ).join('/');
      return {
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

  function search({ node = root, segments = [], path = '' }) {
    const current = segments.shift();

    if (!current) {
      return path;
    }

    if (!node[current]) {
      return '';
    }

    return search({
      node: node[current],
      segments,
      path: `${path}/${current}`,
    });
  }

  function getSegments(path) {
    return path.split('/').filter(Boolean);
  }
};
