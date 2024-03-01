export const getElements =
  (selectors = []) =>
  (element) =>
    Object.fromEntries(
      selectors.map((selector) => [selector, element.querySelector(selector)]),
    );

export const html = (parts, ...values) => {
  const [firstPart, ...rest] = parts;
  return (
    firstPart + rest.map((part, index) => escape(values[index]) + part).join('')
  );
};

const escape = (html) =>
  String(html).replace(
    /[&<>"]/g,
    (match) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
      })[match],
  );
