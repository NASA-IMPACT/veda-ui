import { useEffect, useState } from 'react';

/**
 * usePathname
 * *
 * This hook is implemented to work in both client-side rendering
 * and server-side rendering environments. During SSR, it initializes the
 * `pathname` as an empty string, ensuring the application remains stable in
 * non-browser environments.
 *
 * @returns {string} The current `pathname`. Returns an empty string during SSR
 * or if the `window` object is unavailable.
 */
export const usePathname = () => {
  const [pathname, setPathname] = useState(
    typeof window !== 'undefined'
      ? window.location.pathname.replace(process.env.PUBLIC_URL ?? '', '')
      : ''
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updatePathname = () => {
      setPathname(
        window.location.pathname.replace(process.env.PUBLIC_URL ?? '', '')
      );
    };

    // Listen to popstate events (back/forward navigation)
    window.addEventListener('popstate', updatePathname);

    // Detect programmatic navigation by dispatching a custom event
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    const customEvent = new Event('pathnamechange');
    const dispatchPathnameChange = () => {
      window.dispatchEvent(customEvent);
    };

    history.pushState = function (...args) {
      originalPushState.apply(this, args);
      dispatchPathnameChange();
    };

    history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);
      dispatchPathnameChange();
    };

    window.addEventListener('pathnamechange', updatePathname);

    return () => {
      window.removeEventListener('popstate', updatePathname);
      window.removeEventListener('pathnamechange', updatePathname);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);

  return pathname;
};
