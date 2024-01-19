import { createRange, createTextNode } from '../utils/dom.js';

const errorTemplate = document.createElement('template');
errorTemplate.innerHTML = `<span class="input-error" aria-live="polite"><ui-icon name="exclamation-octagon"></ui-icon></span>`;

export const UILabel = function* ({ $host, $signal: signal }) {
  const { control } = $host;
  $host.append(errorTemplate.content.cloneNode(true));
  const textRange = createRange();
  const inputError = $host.querySelector('.input-error');
  const iconEl = $host.querySelector('.input-error > ui-icon');
  textRange.setStartAfter(iconEl);
  textRange.setEndAfter(iconEl);
  control.addEventListener(
    'invalid',
    (ev) => {
      if (textRange.collapsed) {
        textRange.insertNode(createTextNode(control.validationMessage));
        inputError.classList.toggle('active');
        control.addEventListener(
          'input',
          () => {
            inputError.classList.toggle('active');
            control.setCustomValidity('');
            textRange.deleteContents();
          },
          {
            once: true,
            signal,
          },
        );
      }
    },
    {
      signal,
    },
  );
};
