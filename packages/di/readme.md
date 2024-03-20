# DI

Dependency injection container which leans on the DOM

## Installation 

you can install the library with a package manager (like npm): 
``npm install @cofn/di``

Or import it directly from a CDN

```js
import {provide, inject} from 'https://unpkg.com/@cofn/di/dist/cofn-di.js';
```

## usage

### provide

``provide`` is a higher order function which takes as input either a function which returns a map of injectables or a map of injectables.
If it is a function it takes all as input all the dependencies of the bound generator (ie ``$host``, etc).

The map is an object whose keys are injection tokens (by name or symbol) and the values are factory functions (functions used to create an "instance" of that injectable) or values.
These factories can themselves depends on other injectables:

```js
import {provide} from '@cofn/di';
import {define} from '@cofn/core';

const withAB = provide({
  a: ({b}) => 'a' + b,
  b: 'c'
});

define('some-provider', withAB(function*(){
  
}));
```

When a child element of the DOM tree is also a provider, it can override dependencies for its descendants

```js
const withbbis = provide({
  a: ({b}) => 'a' + b,
  b: 'otherC'
});

define('some-other-provider', withAB(function*(){
  
}));
```

```html
<some-provider>
  
<!-- any element will see injectable "a" as 'ac'  -->
  <some-other-provider>
    <!-- any element will see injectable "a" as 'aotherC'  -->
  </some-other-provider>
  
</some-provider>
```

### inject

A higher order function to declare that the component will have the map of services injected. Services are instantiated only when you call the getter related to a specific injected

```js
import { inject } from '@cofn/di';

define('some-el', inject(function* ({ services }) {

  const { b } = services; // only b is instantiated
  // etc

}));
```




