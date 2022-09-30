export function ConcurrencyManager(concurrentRequests = 15) {
  const queue = [] as (() => Promise<void>)[];
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

export type ConcurrencyManagerInstance = ReturnType<typeof ConcurrencyManager>;
