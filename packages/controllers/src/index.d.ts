import { ComponentRoutine } from '@cofn/core';

type ControllerFn<State, ControllerAPI> = ({
  state,
}: {
  state: State;
}) => ControllerAPI;

export declare function withController<State, ControllerAPI>(
  controllerFn: ControllerFn<State, ControllerAPI>,
): (
  view: ComponentRoutine<
    {
      controller: ControllerAPI & {
        getState: () => State;
      };
    },
    State
  >,
) => ComponentRoutine<State>;
