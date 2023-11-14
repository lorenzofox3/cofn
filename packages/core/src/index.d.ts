type ComponentTag = `${string}-${string}`;

export type ComponentDependencies<T> = T & {
  $signal: AbortSignal;
  $host: HTMLElement & {
    render: <Update>(input?: Update) => void;
  };
  $root: ShadowRoot;
};
export type ComponentRoutine<RenderingState, ExtraDep = {}> = (
  dependencies: ComponentDependencies<ExtraDep>,
) => {
  next(input?: RenderingState & { attributes: Record<string, string> }): any;
  return(value: any): void;
};

export declare function define<RenderingState>(
  tag: ComponentTag,
  component: ComponentRoutine<RenderingState>,
  options?: {
    shadow?: ShadowRootInit;
    extends?: string;
    observedAttributes?: string[];
  },
): void;
