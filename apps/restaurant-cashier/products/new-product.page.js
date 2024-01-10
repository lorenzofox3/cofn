const template = document.createElement('template');
template.innerHTML = `<header>
<h1 tabindex="-1">Add new product</h1><a href="/products" is="ui-page-link" class="button-like"><ui-icon name="x"></ui-icon><span>cancel</span></a>
</header>
<form class="new-product-form">
    <label>
      <span>sku</span>
      <input name="sku" type="text" required />
    </label>
    <label>
      <span>title</span>
      <input name="title" type="text" required />
    </label>
    <label>
      <span>description</span>
      <textarea name="description"></textarea>
    </label>
    <label>
      <span>price</span>
      <input pattern="\\d+(\.\\d+)" name="price" type="text" required />
    </label>
    <button>
      <ui-icon name="plus"></ui-icon>
      Create
    </button>
</form>`;
export const loadPage = async () => {
  const handleSubmit = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    console.log('submit');
  };
  const page = template.content.cloneNode(true);
  page.querySelector('form').addEventListener('submit', handleSubmit);
  return page;
};
