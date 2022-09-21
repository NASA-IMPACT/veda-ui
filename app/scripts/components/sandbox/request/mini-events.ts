export default function EventEmitter() {
  const _events = {};
  return {
    fire(event: string, ...args: Array<any>) {
      if (!_events[event]) return;
      _events[event].forEach((callback) => callback(...args));
    },
    on(event: string, callback: (...args: Array<any>) => any) {
      if (!_events[event]) _events[event] = [];
      _events[event].push(callback);
    },
    off(event: string) {
      if (!_events[event]) return;
      delete _events[event];
    }
  };
}
