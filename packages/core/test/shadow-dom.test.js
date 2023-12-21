import { test } from '@cofn/test-lib/client';
import { define } from '../src/index.js';

const debug = document.getElementById('debug');
function* component({ $root }) {
  while (true) {
    yield;
    $root.textContent = 'hello';
  }
}

test('when shadow dom option is passed, $root becomes the shadow root', ({
  eq,
}) => {
  define('shadow-dom', component, {
    shadow: {
      mode: 'open',
    },
  });

  define('light-dom', component);
  const elLight = document.createElement('light-dom');
  const elShadow = document.createElement('shadow-dom');
  debug.appendChild(elLight);
  eq(elLight.textContent, 'hello');
  eq(elShadow.textContent, '');
});
