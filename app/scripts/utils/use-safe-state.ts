import { useCallback, useEffect, useRef, useState } from "react";

/**
 * React hook to set state. Same behavior as useState but won't set the state if
 * the component is unmounted.
 * @param {*} initialValue Initial state value.
 */
 export const useSafeState = <T>(initialValue: T): [T, React.Dispatch<T>] => {
  const isMountedRef = useRef(true);
  const [currentValue, setCurrentValue] = useState(initialValue);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, [isMountedRef]);

  const setSafeState = useCallback((value) => {
    if (isMountedRef && isMountedRef.current) {
      setCurrentValue(value);
    }
  }, []);

  return [currentValue, setSafeState];
};