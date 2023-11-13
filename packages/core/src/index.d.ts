type ComponentTag = `${string}-${string}`;

export type ComponentRoutine<
  RenderingState,
  Root extends HTMLElement | ShadowRoot = HTMLElement,
> = (x: {
  $signal: AbortSignal;
  $host: HTMLElement & {
    render: (
      input?: RenderingState & { attributes?: Record<string, string> },
    ) => void;
  };
  $root: Root;
}) => {
  next(input?: RenderingState & { attributes: Record<string, string> }): any;
  return(value: any): void;
};

export declare function define<RenderingState>(
  tag: ComponentTag,
  component: ComponentRoutine<RenderingState, ShadowRoot>,
  options: {
    shadow: ShadowRootInit;
    extends?: string;
    observedAttributes?: string[];
  },
): void;
export declare function define<RenderingState>(
  tag: ComponentTag,
  component: ComponentRoutine<RenderingState>,
  options?: {
    extends?: string;
    observedAttributes?: string[];
  },
): void;
