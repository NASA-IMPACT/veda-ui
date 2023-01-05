import { useEffect } from 'react';

export function useScrollbarWidthAsCssVar(varName = '--scrollbar-width') {
  useEffect(() => {
    const el = document.createElement('div');
    el.style.cssText = 'overflow:scroll; visibility:hidden; position:absolute;';
    document.body.appendChild(el);
    const width = el.offsetWidth - el.clientWidth;
    el.remove();

    document.documentElement.style.setProperty(varName, width + 'px');

    () => {
      document.documentElement.style.removeProperty(varName);
    };
  }, [varName]);
}
