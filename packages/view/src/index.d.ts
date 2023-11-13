import { ComponentRoutine } from '@cofn/core/src';

type TemplateRecord = {
  content: DocumentFragment;
};

type TemplatTagFunction = (
  templateParts: [string, ...string[]],
  ...values: unknown[]
) => TemplateRecord;

export declare function createHTML({
  $signal,
}: {
  $signal: AbortSignal;
}): TemplatTagFunction;

type CoRoutineDeps<State, Root> = {
  $signal: AbortSignal;
  $host: HTMLElement & {
    render: (input?: State & { attributes?: Record<string, string> }) => void;
  };
  $root: Root;
};

export declare function withView<
  State,
  Root extends HTMLElement | ShadowRoot = HTMLElement,
>(
  viewFactory: (
    deps: CoRoutineDeps<State, Root> & { html: TemplatTagFunction },
  ) => (
    state: State & { attributes: Record<string, string> },
  ) => TemplateRecord,
): (
  view: (deps: CoRoutineDeps<State, Root>) => {
    next(input?: State & { attributes: Record<string, string> }): any;
    return(value: any): void;
  },
) => ComponentRoutine<State, Root>;
