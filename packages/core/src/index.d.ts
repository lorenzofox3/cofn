type ComponentTag = `${string}-${string}`;

export type ComponentDependencies<T = unknown> = T & {
  $signal: AbortSignal;
  $host: HTMLElement & {
    render: <Update extends Record<unknown, unknown>>(input?: Update) => void;
  };
  $root: ShadowRoot;
};

export type ComponentRoutine<
  Dependencies = unknown,
  RenderingState = unknown,
> = (dependencies: ComponentDependencies<Dependencies>) => Generator<
  unknown,
  any,
  RenderingState & {
    attributes: Record<string, string>;
  }
>;

export declare function define<RenderingState>(
  tag: ComponentTag,
  component: ComponentRoutine<Record<string, never>, RenderingState>,
  options?: {
    shadow?: ShadowRootInit;
    extends?: string;
    observedAttributes?: string[];
  },
): void;
