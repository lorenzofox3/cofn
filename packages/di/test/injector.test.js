import { test } from '@cofn/test-lib/client';
import { createInjector } from '../src/injector.js';

test('instantiates an injectable, calling the factory', ({ eq }) => {
  const { a } = createInjector({
    services: {
      a: () => 'a',
    },
  });

  eq(a, 'a');
});

test('instantiates an injectable, when it is a value', ({ eq }) => {
  const { a } = createInjector({
    services: {
      a: 'a',
    },
  });

  eq(a, 'a');
});

test('everytime the getter is called a new instance is created', ({
  eq,
  isNot,
}) => {
  const services = createInjector({
    services: {
      a: () => ({ prop: 'a' }),
    },
  });
  const instance1 = services.a;
  const { a: instance2 } = services;
  eq(instance1, { prop: 'a' });
  eq(instance2, { prop: 'a' });
  isNot(instance2, instance1);
});

test('resolves dependency graph, instantiating the transitive dependencies ', ({
  eq,
}) => {
  const services = createInjector({
    services: {
      a: ({ b, c }) => b + '+' + c,
      b: () => 'b',
      c: ({ d }) => d,
      d: 'd',
    },
  });
  eq(services.a, 'b+d');
});

test('injection tokens can be symbols', ({ eq }) => {
  const aSymbol = Symbol('a');
  const bSymbol = Symbol('b');
  const cSymbol = Symbol('c');
  const dSymbol = Symbol('d');

  const services = createInjector({
    services: {
      [aSymbol]: ({ [bSymbol]: b, [cSymbol]: c }) => b + '+' + c,
      [bSymbol]: () => 'b',
      [cSymbol]: ({ [dSymbol]: d }) => d,
      [dSymbol]: 'd',
    },
  });
  eq(services[aSymbol], 'b+d');
});

test(`only instantiates an injectable when required`, ({ eq, notOk, ok }) => {
  let aInstantiated = false;
  let bInstantiated = false;
  let cInstantiated = false;

  const services = createInjector({
    services: {
      a: ({ b }) => {
        aInstantiated = true;
        return b;
      },
      b: () => {
        bInstantiated = true;
        return 'b';
      },
      c: () => {
        cInstantiated = true;
        return 'c';
      },
    },
  });

  const { a } = services;

  eq(a, 'b');
  ok(aInstantiated);
  ok(bInstantiated);
  notOk(cInstantiated);

  const { c } = services;
  eq(c, 'c');
  ok(cInstantiated);
});

test('gives a friendly message when it can not resolve a dependency', ({
  eq,
  fail,
}) => {
  const services = createInjector({
    services: {
      a: ({ b }) => b,
      b: ({ c }) => c,
    },
  });

  try {
    const { a } = services;
    fail('should not reach that statement');
  } catch (err) {
    eq(err.message, 'could not resolve injectable "c"');
  }
});
