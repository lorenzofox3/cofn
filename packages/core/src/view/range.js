const comment = (data) => document.createComment(data);

export const createRange = ({ node, templateCache }) => {
  const range = document.createRange();
  const before = comment('before');
  const after = comment('after');
  let currentContent;
  node.before(before);
  node.after(after);
  return {
    replaceWith(newContent) {
      range.setStartAfter(before);
      range.setEndBefore(after);

      if (Array.isArray(newContent)) {
        const oldGroup = groupByKey(
          Array.isArray(currentContent) ? currentContent : [],
        );
        const newGroup = groupByKey(newContent);

        Object.entries(oldGroup)
          .filter(([key]) => !(key in newGroup))
          .forEach(([, activeSite]) => removeOldContent(activeSite));

        newContent.forEach((activeSite, index) => {
          const pivot = newContent[index - 1]?.content ?? before;
          if (pivot.nextElementSibling !== activeSite.content) {
            pivot.after(activeSite.content);
          }
        });
      } else {
        range.deleteContents();
        if (newContent?.content) {
          const { content } = newContent;
          range.insertNode(content);
          delete newContent.content; // drop useless fragment to free memory
        }
        removeOldContent(currentContent);
      }
      return (currentContent = newContent);
    },
  };

  function removeOldContent(content) {
    const activeSites = Array.isArray(content) ? content : [content];
    activeSites.forEach((site) => {
      site?.remove?.();
      templateCache.delete(site?.key);
    });
  }
};

const groupByKey = (array) =>
  array.reduce(
    (acc, curr) => ({
      ...acc,
      [curr.key]: curr,
    }),
    {},
  );
