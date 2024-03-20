# Controllers

A set of higher order function to add update logic to a coroutine component

## Installation 

you can install the library with a package manager (like npm): 
``npm install @cofn/controllers``

Or import it directly from a CDN

```js
import {withController} from 'https://unpkg.com/@cofn/controllers/dist/cofn-controllers.js';
```

## Reactive props

Defines a list of properties to watch. The namespace ``properties`` is injected into the rendering generator 

```js
import {define} from '@cofn/core';
import {withProps} from '@cofn/controllers'

const withName = withProps(['name']);

define('my-comp', withNameAndAge(function *({$root}){
  while(true) {
    const { properties } = yield;
    $root.textContent = properties.name;
  }
}));

// <my-comp></my-comp>

myCompEl.name = 'Bob'; // > render

// ...

myCompEl.name = 'Woot'; // > render

```

## Controller API

Defines a controller passed to the rendering generator. Takes as input a factory function which returns the controller.

The regular component dependencies are injected into the controller factory and a meta object ``state``. 
Whenever a property is set on this meta object, the component renders. The namespace ``state`` is injected into the rendering generator.

```js
import {define} from '@cofn/core';
import {withController} from '@cofn/controller';

const withCountController = withController(({state, $host}) => {
  const step = $host.hasAttribute('step') ? Number($host.getAttribute('step')) : 1;
  state.count = 0;

  return {
    increment(){
      state = state + step;
    },
    decrement(){
      state = state - step;
    }
  };
});

define('count-me',withCountController(function *({$root, controller}){
  $root.replaceChildren(template.content.cloneNode(true));
  const [decrementEl, incrementEl] = $host.querySelectorAll('button');
  const countEl = $host.querySelector('span');

  decrementEl.addEventListener('click', controller.decrement);
  incrementEl.addEventListener('click', controller.increment);

  while(true) {
    const { $scope } = yield;
    countEl.textContent = $scope.count;
  }
}));
```
