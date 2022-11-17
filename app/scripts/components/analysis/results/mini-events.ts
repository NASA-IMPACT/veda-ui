/* eslint-disable @typescript-eslint/no-explicit-any */

export default function EventEmitter() {
  const _events = {};
  return {
    fire(event: string, ...args: any[]) {
      if (!_events[event]) return;
      _events[event].forEach((callback) => callback(...args));
    },
    on(event: string, callback: (...args: any[]) => any) {
      if (!_events[event]) _events[event] = [];
      /* eslint-disable-next-line fp/no-mutating-methods */
      _events[event].push(callback);
    },
    off(event: string) {
      if (!_events[event]) return;
      _events[event] = undefined;
    }
  };
}
