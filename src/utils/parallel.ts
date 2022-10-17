/* eslint-disable consistent-return */
/* eslint-disable no-promise-executor-return */
export interface Queue<T> {
  retryCount: number;
  value: T;
}

export type Handler<T, R> = (value: T) => Promise<R>;

export interface ErrorHandlerArg<T> {
  error: Error;
  item: T;
  retryCount: number;
}

export type ErrorHandler<T> = (args: ErrorHandlerArg<T>) => void | true;

export interface SuccessLogArgs<T> {
  currentValue: T;
  counter: number;
  length: number;
  inProgress: number;
}

export type SuccessLogHandler<T> = (args: SuccessLogArgs<T>) => void;

export interface Options<T, R> {
  concurrency?: number;
  timeout?: number;
  needResults?: boolean;
  handler: Handler<T, R>;
  errorHandler: ErrorHandler<T>;
  successLog?: SuccessLogHandler<T>;
}

export const waitFor = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const parallel = async <T, R>(data: T[], options: Options<T, R>) => {
  const {
    concurrency = 5,
    timeout = 1000,
    needResults = true,
    handler,
    errorHandler,
    successLog = () => {},
  } = {
    ...options,
  };

  const queue: Queue<T>[] = data.map((value) => ({ value, retryCount: 0 }));
  const results: R[] = [];
  const errors = new Map<T, Error[]>();
  const tasks: Set<Promise<void>> = new Set();
  let counter = 0;

  const addError = (key: T, error: Error) => {
    errors.set(key, [...(errors.get(key) || []), error as Error]);
  };

  const runThread = async (item: Queue<T>): Promise<void> => {
    try {
      const result = await handler(item.value);
      if (needResults) results.push(result);
      successLog({
        currentValue: item.value,
        counter: (counter += 1),
        inProgress: tasks.size,
        length: queue.length,
      });
      errors.delete(item.value);
    } catch (e) {
      addError(item.value, e as Error);

      const needToRetry = errorHandler({
        error: e as Error,
        item: item.value,
        retryCount: item.retryCount,
      });

      if (needToRetry) {
        item.retryCount += 1;
        return runThread(item);
      }
    } finally {
      await waitFor(timeout);
    }
  };

  for (const item of queue) {
    const thread = runThread(item);
    tasks.add(thread);
    thread.then(() => tasks.delete(thread));
    if (tasks.size >= Math.min(concurrency, queue.length)) await Promise.race(tasks);
  }

  await Promise.all(tasks);

  return [results, errors] as const;
};
