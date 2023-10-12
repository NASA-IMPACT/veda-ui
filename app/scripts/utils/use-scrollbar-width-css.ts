import { useEffect } from 'react';

let scrollbarWidthCache;
export function getScrollbarWidth() {
  if (scrollbarWidthCache !== undefined) {
    return scrollbarWidthCache;
  }

  const el = document.createElement('div');
  el.style.cssText = 'overflow:scroll; visibility:hidden; position:absolute;';
  document.body.appendChild(el);
  const width = el.offsetWidth - el.clientWidth;
  el.remove();

  scrollbarWidthCache = width;
  return width;
}

export function useScrollbarWidthAsCssVar(varName = '--scrollbar-width') {
  useEffect(() => {
    const width = getScrollbarWidth();
    document.documentElement.style.setProperty(varName, width + 'px');

    return () => {
      document.documentElement.style.removeProperty(varName);
    };
  }, [varName]);
}
