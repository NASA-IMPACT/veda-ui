import { useEffect, useState } from 'react';

export const HEADER_ID = 'page-header';
export const HEADER_WRAPPER_ID = 'header-wrapper';

export function useSlidingStickyHeader() {
  // Get the height of the header and he wrapper. Both are needed because in
  // some pages the wrapper contains the local nav as well.
  const headerHeightQueried = document.querySelector<HTMLElement>(
    `#${HEADER_ID}`
  )?.offsetHeight;
  const wrapperHeightQueried = document.querySelector<HTMLElement>(
    `#${HEADER_WRAPPER_ID}`
  )?.offsetHeight;

  // The header is hidden if the page is loaded and the user is scrolled
  // mid-way.
  const [isHidden, setHidden] = useState(
    window.pageYOffset > (headerHeightQueried || 0)
  );
  const [headerHeight, setHeaderHeight] = useState(headerHeightQueried);
  const [wrapperHeight, setWrapperHeight] = useState(wrapperHeightQueried);

  useEffect(() => {
    let reqId;
    let lastTs = 0;
    let prevY = window.pageYOffset;
    let scrollUpDelta = 0;

    function tick(ts) {
      if (!lastTs || ts - lastTs >= 10) {
        lastTs = ts;

        const currY = window.pageYOffset;

        const wrapperEl = document.querySelector(
          `#${HEADER_WRAPPER_ID}`
        ) as HTMLElement;
        setWrapperHeight(wrapperEl?.offsetHeight || 0);

        const el = document.querySelector<HTMLElement>(`#${HEADER_ID}`);
        const headerHeightQueried = el?.offsetHeight || 0;
        setHeaderHeight(headerHeightQueried);

        if (currY <= headerHeightQueried) {
          // When the header gets hidden the css transitions the element out of
          // the viewport by applying a negative translate. (See NavWrapper). If
          // the user scrolls to the top of the page quickly and the header
          // still has to animate to be shown it looks like a glitch because a
          // white area will be seen. In this situation we remove the
          // translation so that it looks like the header is already there.
          // Additionally this has to be done by accessing the DOM node directly
          // instead of using a state because the styled component does not
          // update fast enough.
          wrapperEl.style.transition = 'none';
          // Visible if within its height.
          setHidden(false);
          scrollUpDelta = 0;
        } else if (currY < prevY) {
          // Scrolling up.
          scrollUpDelta += prevY - currY;
          // When scrolling up we want some travel before showing the header
          // again.
          if (scrollUpDelta > 64) {
            wrapperEl.style.transition = '';
            setHidden(false);
          }
        } else if (currY > prevY) {
          wrapperEl.style.transition = '';
          // Scrolling down.
          setHidden(true);
          scrollUpDelta = 0;
        }

        prevY = currY;
      }
      reqId = window.requestAnimationFrame(tick);
    }

    reqId = window.requestAnimationFrame(tick);

    return () => {
      reqId && window.cancelAnimationFrame(reqId);
    };
  }, []);

  return { isHeaderHidden: isHidden, headerHeight, wrapperHeight };
}
