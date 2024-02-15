import { ComponentRoutine, ComponentDependencies } from '@cofn/core';

type ControllerFn<State, Controller, Dependencies = unknown> = (
  controllerDeps: {
    state: State;
  } & ComponentDependencies<Dependencies>,
) => Controller;

export declare function withController<
  State,
  Controller,
  Dependencies = unknown,
>(
  controllerFn: ControllerFn<State, Controller, Dependencies>,
): (
  view: ComponentRoutine<
    {
      controller: Controller & { getState: () => State };
    } & Dependencies,
    { state: State }
  >,
) => ComponentRoutine<Dependencies, { state: State }>;
