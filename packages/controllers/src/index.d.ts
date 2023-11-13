import { ComponentRoutine } from '@cofn/core';

type ControllerFn<State, ControllerAPI> = ({
  state,
}: {
  state: State;
}) => ControllerAPI;

export declare function withController<State, ControllerAPI>(
  controllerFn: ControllerFn<State, ControllerAPI>,
): <Root extends HTMLElement | ShadowRoot = HTMLElement>(
  view: (deps: {
    $signal: AbortSignal;
    $host: HTMLElement & {
      render: (input?: State & { attributes?: Record<string, string> }) => void;
    };
    $root: Root;
    controller: ControllerAPI;
  }) => {
    next(input?: State & { attributes: Record<string, string> }): any;
    return(value: any): void;
  },
) => ComponentRoutine<State, Root>;
