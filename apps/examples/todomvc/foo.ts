import { define } from '@cofn/core';
import { withController } from '@cofn/controllers';
import { withView } from '@cofn/view';

type State = {
  toto: number;
  foo: string;
};

const withFooController = withController(({ state }: { state: State }) => {
  state.foo = '42';

  return {
    increment(count: number) {},
    blah(woot: string) {},
  };
});

define<State>('blah-woo', function* () {});

define(
  'some-tag',
  withFooController(function* ({ controller, $root }) {
    controller.increment(23);
  }),
  {
    shadow: { mode: 'open' },
  },
);

define(
  'blah-woot',
  withView<{ foo: string }>(({ html }) => (state) => {
    return html`foo${state.foo}`;
  }),
);
