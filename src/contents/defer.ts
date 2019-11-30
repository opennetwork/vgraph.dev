export function defer<T>(): { resolve: T extends void ? () => void : (value: T) => void, reject: (error: unknown) => void, promise: Promise<T> } {
  let resolve,
    reject;
  const promise = new Promise<T>(
    (resolveFn, rejectFn) => {
      resolve = resolveFn;
      reject = rejectFn;
    }
  );
  return { resolve, reject, promise };
}
