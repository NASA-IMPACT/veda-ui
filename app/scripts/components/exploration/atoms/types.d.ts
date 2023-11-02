export type AtomValueUpdater<T> = T | ((prev: T) => T);
