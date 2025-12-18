import { useCallback, useState } from 'react';

export function useDisplay() {
  const [display, setDisplay] = useState<boolean>(false);

  return {
    isRevealed: display,
    show: useCallback(() => setDisplay(true), [setDisplay]),
    hide: useCallback(() => setDisplay(false), [setDisplay])
  };
}
