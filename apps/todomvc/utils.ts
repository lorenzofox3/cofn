export function compose<Input, FirstArg, SecondArg>(
  fns: [
    func2: (input: FirstArg) => SecondArg,
    func: (input: Input) => FirstArg,
  ],
): (input: Input) => SecondArg {
  // return (arg) => fns.reduceRight((y, fn) => fn(y), arg);
  const [fn1, fn2] = fns;
  return (arg) => {
    return fn1(fn2(arg));
  };
}
export const not =
  <K>(fn: (args: K) => boolean) =>
  (arg: K) =>
    !fn(arg);
export const mapValues =
  <K, T>(mapFn: (item: K) => T) =>
  <Obj extends Record<string, K>>(obj: Obj): Record<keyof Obj, T> =>
    Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, mapFn(value)]),
    ) as any;
