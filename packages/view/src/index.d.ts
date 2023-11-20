import {
  ComponentDependencies as _ComponentDependencies,
  ComponentRoutine,
} from '@cofn/core';

type TemplateRecord = {
  content: DocumentFragment;
};

type TemplateTagFunction = (
  templateParts: TemplateStringsArray,
  ...values: unknown[]
) => TemplateRecord;

export type ComponentDependencies<T = unknown> = _ComponentDependencies<
  T & {
    html: TemplateTagFunction;
  }
>;

export declare function createHTML({
  $signal,
}: {
  $signal: AbortSignal;
}): TemplateTagFunction;

type ViewFunction<State = unknown> = (
  state: State & { attributes: Record<string, string> },
) => TemplateRecord;

export type ViewFactory<Dependencies = unknown, State = unknown> = (
  dependencies: ComponentDependencies<Dependencies>,
) => ViewFunction<State>;

export declare function withView<Dependencies = unknown, State = unknown>(
  viewFactory: ViewFactory<Dependencies, State>,
): ComponentRoutine<Dependencies, State>;
