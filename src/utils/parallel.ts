/* eslint-disable consistent-return */
export interface IFetcher<T, R> {
  (arg: T): Promise<R | R[]>;
}

export interface IFetchError<T> {
  message: string;
  src: T;
}

export interface IOptions {
  /** Колличество одновременных запросов */
  streams?: number;
  /** Время задержки между запросами в ms */
  timeout?: number;
}

export interface IDone<T, R> {
  results: R[];
  errors: IFetchError<T>[];
}

export const parallel = async <T, R>(
  /** Массив со входными данными */
  arr: T[],
  /** Функция которая принимает входной элемент, производит с ним действия и возвращает промис */
  fetcher: IFetcher<T, R>,
  { streams = 10, timeout = 1000 }: IOptions = {},
): Promise<IDone<T, R>> => {
  const source: T[] = [...arr];
  const results: R[] = [];
  const errors: IFetchError<T>[] = [];
  const tasks: Promise<any>[] = [];

  const wait = (ms: number): Promise<void> =>
    new Promise((r) => {
      setTimeout(r, ms);
    });

  const run = async (): Promise<any> => {
    if (source.length === 0) return;
    const current = source.shift() as T;

    return fetcher(current)
      .then((result) => (Array.isArray(result) ? results.push(...result) : results.push(result)))
      .catch((err: Error) => errors.push({ src: current, message: err.message }))
      .then(() => wait(timeout))
      .then(run);
  };

  for (let i = 0; i < streams; i++) tasks.push(run());

  await Promise.all(tasks);

  return {
    results,
    errors,
  };
};
