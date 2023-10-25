const comment = (data) => document.createComment(data);

export const createRange = ({ node, templateCache }) => {
  const range = new Range();
  const before = comment('before');
  const after = comment('after');
  let currentContent;
  node.before(before);
  node.after(after);
  return {
    replaceWith(newContent) {
      range.setStartAfter(before);
      range.setEndBefore(after);
      range.deleteContents();
      if (newContent?.fragment) {
        const { fragment } = newContent;
        range.insertNode(fragment);
        delete newContent.fragment; // drop useless fragment
      }
      templateCache.delete(currentContent?.key); // old node is permanently removed
      return (currentContent = newContent);
    },
  };
};
