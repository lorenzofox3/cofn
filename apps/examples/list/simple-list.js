export const List = ({ html, $host }) => {
  return (state) => {
    const {
      items = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' },
        { id: 4, name: 'Item 4' },
        { id: 5, name: 'Item 5' },
        { id: 6, name: 'Item 6' },
        { id: 7, name: 'Item 7' },
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
