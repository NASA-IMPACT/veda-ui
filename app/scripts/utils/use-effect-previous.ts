import { DependencyList, useEffect, useLayoutEffect, useRef } from 'react';

type EffectPreviousCb<T> = (
  previous: T,
  mounted: boolean
) => void | (() => void);

function makePreviousHook(effectHook) {
  return <T extends DependencyList>(
    cb: EffectPreviousCb<T | undefined[]>,
    deps: T
  ) => {
    const prev = useRef<DependencyList | undefined[]>([]);
    const mounted = useRef(false);
    const unchangingCb = useRef<EffectPreviousCb<T | undefined[]>>(cb);
    unchangingCb.current = cb;

    effectHook(() => {
      const r = unchangingCb.current(prev.current as T, mounted.current);
      prev.current = deps;
      if (!mounted.current) mounted.current = true;
      return r;
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, deps);
  };
}

/**
 * Same behavior as React's useEffect but called with the values for the
 * previous dependencies and with a flag tracking whether or not the component
 * is mounted
 * @param {func} cb Hook callback
 * @param {array} deps Hook dependencies.
 */
export const useEffectPrevious = makePreviousHook(useEffect);

/**
 * Same behavior as React's useLayoutEffect but called with the values for the
 * previous dependencies and with a flag tracking whether or not the component
 * is mounted
 * @param {func} cb Hook callback
 * @param {array} deps Hook dependencies.
 */
export const useLayoutEffectPrevious = makePreviousHook(useLayoutEffect);

/**
 * Hook to store the previous value of a variable.
 *
 * @param value The value to store
 * @param isEqualFunc Fuction to compare the previous value with the current
 * value.
 * @returns The previous value
 */
export const usePreviousValue = <T>(
  value: T,
  isEqualFunc = (a: T | undefined, b: T) => a === b
): T | undefined => {
  const ref = useRef<T | undefined>(undefined);

  const current = ref.current;

  if (!isEqualFunc(current, value)) {
    ref.current = value;
  }

  return current;
};
