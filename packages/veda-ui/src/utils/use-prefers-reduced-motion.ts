import { useEffect, useState } from 'react';

export default function useReducedMotion() {
  const mediaQuery =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;

  const [reducedMotion, setReducedMotion] = useState(
    mediaQuery?.matches || false
  );

  useEffect(() => {
    if (!mediaQuery) return;

    const listener = () => setReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', listener);

    return () => {
      mediaQuery.removeEventListener('change', listener);
    };
  }, []);

  return reducedMotion;
}
