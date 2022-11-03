import { useEffect, useState } from 'react';

export const HEADER_ID = 'page-header';
export const HEADER_WRAPPER_ID = 'header-wrapper';

export function useSlidingStickyHeader() {
  const [isHidden, setHidden] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [wrapperHeight, setWrapperHeight] = useState(0);

  useEffect(() => {
    let ticking = false;
    let prevY = window.scrollY;
    let scrollUpDelta = 0;

    const navWrapperElement = document.querySelector<HTMLElement>(
      `#${HEADER_WRAPPER_ID}`
    );
    if (!navWrapperElement) {
      throw new Error(`Element #${HEADER_WRAPPER_ID} was not found.`);
    }
    // When the element mounts the <Suspense> element is still in the DOM and
    // the page has display: none. The result is that any measurement of the
    // header would be 0. By using an IntersectionObserver we are able to get
    // the correct height once the element becomes visible.
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        observer.unobserve(navWrapperElement);

        // Initial height.
        // Get the height of the header and he wrapper. Both are needed because in
        // some pages the wrapper contains the local nav as well.
        const headerHeightQueried =
          document.querySelector<HTMLElement>(`#${HEADER_ID}`)?.offsetHeight ||
          0;

        setHeaderHeight(headerHeightQueried);
        setWrapperHeight(navWrapperElement.offsetHeight);
        // The header is hidden if the page is loaded and the user is scrolled
        // mid-way.
        setHidden(window.scrollY > headerHeightQueried);
      }
    });
    observer.observe(navWrapperElement);

    function tick(currY) {
      const wrapperEl = document.querySelector(
        `#${HEADER_WRAPPER_ID}`
      ) as HTMLElement;
      setWrapperHeight(wrapperEl?.offsetHeight || 0);

      const el = document.querySelector<HTMLElement>(`#${HEADER_ID}`);
      const headerHeightQueried = el?.offsetHeight || 0;
      setHeaderHeight(headerHeightQueried);

      // When the document is scrolled quickly to the bottom of the page, the
      // shrinking header causes the scroll event to be fired again, and since
      // the page is shrinking, the scrollY is decreasing leading to the page
      // header being shown as it is being considered a scroll up.
      // By checking if we are at the bottom, we can prevent this.
      const atTheBottom =
        window.innerHeight + Math.ceil(window.pageYOffset) >=
        document.body.offsetHeight;

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
      } else if (currY < prevY && !atTheBottom) {
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

    function onViewportPositionChange(e) {
      if (!ticking) {
        // instead of setting a specific number of ms to wait (throttling),
        // pass it to the browser to be processed on the next frame, whenever that may be.
        window.requestAnimationFrame(() => {
          tick(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onViewportPositionChange);
    window.addEventListener('resize', onViewportPositionChange);

    return () => {
      window.removeEventListener('scroll', onViewportPositionChange);
      window.removeEventListener('resize', onViewportPositionChange);
    };
  }, []);

  return { isHeaderHidden: isHidden, headerHeight, wrapperHeight };
}
