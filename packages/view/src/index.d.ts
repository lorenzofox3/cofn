import { ComponentDependencies, ComponentRoutine } from '@cofn/core';

type TemplateRecord = {
  content: DocumentFragment;
};

type TemplateTagFunction = (
  templateParts: TemplateStringsArray,
  ...values: unknown[]
) => TemplateRecord;

export declare function createHTML({
  $signal,
}: {
  $signal: AbortSignal;
}): TemplateTagFunction;

type ViewFactory<State> = (
  dependencies: ComponentDependencies<{ html: TemplateTagFunction }>,
) => (state: State & { attributes: Record<string, string> }) => TemplateRecord;

export declare function withView<State>(
  viewFactory: ViewFactory<State>,
): ComponentRoutine<State>;
