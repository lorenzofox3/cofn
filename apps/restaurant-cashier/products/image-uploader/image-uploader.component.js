import { createElement } from '../../utils/dom.js';
import { imagesService } from './images.service.js';

const template = createElement('template');
template.innerHTML = `
<style>
:host {
   --control-color: white;
   display: grid;
   place-items: center;
   aspect-ratio: 3 / 2;
   cursor: pointer;
   position: relative;
   isolation: isolate;
   overflow: hidden;
}

:host > *, :host::after, :host::before {
  grid-row: 1;
  grid-column: 1;
}

@keyframes move-right {
  from {
    background-position-x: -20%;
  }

  to {
    background-position-x: 170%;
  }
}

:host([status=loading])::after {
  content: '';
  height: 10px;
  position: absolute;
  z-index: -1;
  width: 100%;
  bottom: 0;
  justify-self: end;
  background-image: linear-gradient(to right, transparent, var(--control-color) 20%, var(--control-focus-color) 80%, transparent);
  background-size: 50%;
  background-repeat: no-repeat;
  animation: 0.6s ease-in-out infinite alternate move-right;
}

img{
  position: absolute;
  inset:0;
  z-index: -10;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

input {
  display: none;
}

img:not([src]), 
img[src=''] {
  display: none;
}


</style>

<input accept="image/*" tabindex="-1" type="file" />
<button part="button">upload image</button>
<img aria-hidden="true" alt="" />
`;

export const ImageUploader = function* ({ $host, $root, $signal: signal }) {
  $root.append(template.content.cloneNode(true));
  const img = $root.querySelector('img');
  const input = $root.querySelector('input');
  const button = $root.querySelector('button');

  window.addEventListener('dragenter', handleDragEnter, { signal });
  window.addEventListener('drop', windowDrop, { signal });
  window.addEventListener('dragover', handleDragOver, { signal });
  $host.addEventListener('click', () => input.click());
  $host.addEventListener('drop', handleDrop);
  input.addEventListener(
    'change',
    () => {
      const { files } = input;
      const file = files.item(0);
      handleFileChange(file);
    },
    { signal },
  );

  while (true) {
    const { attributes } = yield;
    const { url = '', status = 'idle' } = attributes;
    const label = getLabel({ url, status });
    input.disabled = button.disabled = status === 'loading';
    button.textContent = label;
    img.setAttribute('src', url);
  }

  async function handleFileChange(file) {
    $host.setAttribute('status', 'loading');
    try {
      const { url } = await imagesService.uploadImage({ file });
      $host.setAttribute('url', url);
      $host.setAttribute('status', 'idle');
      $host.dispatchEvent(
        new CustomEvent('image-uploaded', {
          detail: {
            url,
          },
        }),
      );
    } catch (e) {
      console.error(e);
      $host.setAttribute('status', 'error');
    }
  }
  function handleDrop(ev) {
    ev.preventDefault();
    const { items } = ev.dataTransfer;
    if (items && items[0]?.kind === 'file') {
      const file = items[0].getAsFile();
      handleFileChange(file);
    }
  }

  function windowDrop(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    $host.classList.toggle('dragging', false);
  }

  function handleDragEnter(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    $host.classList.toggle('dragging', true);
  }

  function handleDragOver(ev) {
    ev.preventDefault();
    ev.stopPropagation();
  }
};

const getLabel = ({ url, status }) => {
  if (status === 'loading') {
    return 'uploading image...';
  }

  if (status === 'error') {
    return 'an error occurred, try again';
  }

  return (url ? 'change image' : 'add an image') + '(or drop a file)';
};
