import { DependencyList, useEffect, useRef } from 'react';

type EffectPreviousCb<T> = (
  previous: T,
  mounted: boolean
) => void | (() => void);

/**
 * Same behavior as React's useEffect but called with the values for the
 * previous dependencies and with a flag tracking whether or not the component
 * is mounted
 * @param {func} cb Hook callback
 * @param {array} deps Hook dependencies.
 */
export function useEffectPrevious<T extends DependencyList>(
  cb: EffectPreviousCb<T>,
  deps: T
) {
  const prev = useRef<DependencyList>([]);
  const mounted = useRef(false);
  const unchangingCb = useRef<EffectPreviousCb<T>>(cb);
  unchangingCb.current = cb;

  useEffect(() => {
    const r = unchangingCb.current(prev.current as T, mounted.current);
    prev.current = deps;
    if (!mounted.current) mounted.current = true;
    return r;
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, deps);
}
