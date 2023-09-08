export interface ConcurrencyManagerInstance {
  clear: () => void;
  queue: <T>(taskFn: () => Promise<T>) => Promise<T>;
}

export function ConcurrencyManager(
  concurrentRequests = 15
): ConcurrencyManagerInstance {
  let queue: (() => Promise<void>)[] = [];
  let running = 0;

  const run = async () => {
    if (!queue.length || running > concurrentRequests) return;

    const task = queue.shift();
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
    queue: <T>(taskFn: () => Promise<T>): Promise<T> => {
      let resolve;
      let reject;
      const promise = new Promise<T>((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
      });

      queue.push(async () => {
        try {
          const result = await taskFn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      run();

      return promise;
    }
  };
}

// Global concurrency manager instance
export const analysisConcurrencyManager = ConcurrencyManager();
