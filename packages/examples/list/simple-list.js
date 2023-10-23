export const List = ({ html, $host }) => {
  return (state) => {
    const {
      items = [
        { id: 1, name: 'Article X' },
        { id: 2, name: 'Article Y' },
        { id: 3, name: 'Article Z' },
      ],
    } = state;
    return html`
      <ul>
        ${items.map(
          (item, index) =>
            html`${item.id}::
              <li id="${item.id}">${item.name}</li>`,
        )}
      </ul>
    `;
  };
};
