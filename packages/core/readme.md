# Core

Core library to build web components from coroutines.

See the [blog article](https://lorenzofox.dev/posts/component-as-infinite-loop/) for more details.

## Installation 

you can install the library with a package manager (like npm): 
``npm install @cofn/core``

Or import it directly from a CDN

```js
import {define} from 'https://unpkg.com/@cofn/core/dist/cofn-core.js'
```

## Usage

The package exports a ``define`` function you can use to define new custom elements

```js
import { define } from '@cofn/core';

define('hello-world', function* ({ $host, $root, $signal }) {
  // constructing
  let input = yield 'constructured';

  // mounted

  try {
    while (true) {
      $root.textContent = `hello ${input.attributes.name}`;
      input = yield;
      // update requested
    }
  } finally {
    // the instance is removed from the DOM tree: you won't be able to use it anymore
    console.log('clean up')
  }
}, { observedAttributes: ['name'] })

// <hello-world name="lorenzofox"></hello-world> 
```

The component is defined as a generator function which has injected: 
* ``$host``: the custom element instance
* ``$root``: the DOM tree root of the custom element instance. It is either the ``$host`` itself or the ``shadowRoot`` if you have passed shadow dom option in the third optional argument 
* ``$signal``: an ``AbortSignal`` which is triggered when the element is unmounted. This is more for convenience, to ease the cleanup, if you use APIs which can take an abort signal as option. Otherwise, you can run clean up code in the ``finally`` clause.

Because generators are functions, you can use higher order functions and delegation to enhance the custom element behaviour. You will find more details in the [blog](https://lorenzofox.dev)

By default, when the generator yields, the attributes of the custom elements are assigned under the ``attributes`` namespace.

### options

The third argument is optional. It takes the same parameters as the regular [customElementRegistry.define](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define) and some more:
* ``extends``: If you wish to make your custom element extends a built-in element. Careful, webkit refuses to implement that spec and you will need a [polyfill](https://unpkg.com/@ungap/custom-elements@1.3.0/es.js)
* ``shadow``: same as [attachShadow](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow) function.
* ``observedAttributes``: the list of attributes the browser will observe. Any change on the one of these attributes will resume the generator execution.
