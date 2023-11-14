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
    State,
    {
      controller: ControllerAPI & {
        getState: () => State;
      };
    }
  >,
) => ComponentRoutine<State>;
