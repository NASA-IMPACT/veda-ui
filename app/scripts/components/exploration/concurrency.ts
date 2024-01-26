export interface ConcurrencyManagerInstance {
  clear: () => void;
  queue: <T>(key: string, askFn: () => Promise<T>) => Promise<T>;
  dequeue: (key: string) => void;
}

export function ConcurrencyManager(
  // concurrentRequests = 15
  concurrentRequests = 50
): ConcurrencyManagerInstance {
  let queue: [string, () => Promise<void>][] = [];
  let running = 0;

  const run = async () => {
    if (!queue.length || running > concurrentRequests) return;
    /* eslint-disable-next-line fp/no-mutating-methods */
    const [, task] = queue.shift() ?? [];
    if (!task) return;
    running++;
    await task();
    running--;
    run();
  };

  return {
    clear: () => {
      queue = [];
    },
    queue: <T>(key: string, taskFn: () => Promise<T>): Promise<T> => {
      let resolve;
      let reject;
      const promise = new Promise<T>((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
      });

      /* eslint-disable-next-line fp/no-mutating-methods */
      queue.push([
        key,
        async () => {
          try {
            const result = await taskFn();
            resolve(result);
          } catch (error) {
            reject(error);
          }
        }
      ]);

      run();

      return promise;
    },
    dequeue: (key: string) => {
      queue = queue.filter(([k]) => k !== key);
    }
  };
}

// Global concurrency manager instance
export const analysisConcurrencyManager = ConcurrencyManager();
