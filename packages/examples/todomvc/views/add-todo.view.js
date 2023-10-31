export const AddTodoView = ({ html, todoService }) => {
  const handleSubmit = (ev) => {
    ev.preventDefault();
    const { target: form } = ev;
    const content = form.elements.namedItem('new-content').value;
    todoService.addTodo({ content });
    form.reset();
  };

  return () =>
    html`<form @submit="${handleSubmit}">
      <label
        >What needs to be done ?
        <input
          placeholder="ex: build a todo app"
          autofocus
          required
          name="new-content"
          type="text"
        />
      </label>
      <button>Add +</button>
    </form>`;
};
