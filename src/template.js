export const withTemplate = ({ template }) => {
  const templateEl = document.createElement('template');
  templateEl.innerHTML = template;
  return (gen) =>
    function* (arg = {}) {
      const node = templateEl.content.cloneNode(true).firstElementChild;
      return yield* gen({
        ...arg,
        node,
      });
    };
};
