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
      clearContent(newContent);

      if (Array.isArray(newContent)) {
        newContent.forEach((activeSite, index) => {
          const pivot = newContent[index - 1]?.content ?? before;
          if (pivot.nextElementSibling !== activeSite.content) {
            pivot.after(activeSite.content);
          }
        });
      } else if (newContent?.content) {
        const { content } = newContent;
        range.insertNode(content);
        delete newContent.content; // drop useless fragment to free memory
      }
      return (currentContent = newContent);
    },
  };

  function clearContent(newContent) {
    if (!Array.isArray(currentContent)) {
      range.deleteContents();
      templateCache.delete(currentContent?.key);
    } else {
      const oldGroup = groupByKey(currentContent);
      const newGroup = groupByKey(newContent);
      Object.entries(oldGroup)
        .filter(([key]) => !(key in newGroup))
        .forEach(([, activeSite]) => {
          activeSite.content.remove();
          templateCache.delete(activeSite.key);
        });
    }
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
