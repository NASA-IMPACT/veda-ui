import { useState, useEffect } from 'react';

const useScrollDirection = () => {

  // threshold should be bigger than navHeight
  const threshold = 90;
  
  // When user freshly loads the page : show nav
  // When user lands on the middle of page : hide nav
  const initialScrollDir = window.pageYOffset === 0 ? 'up' : 'down';
  const [scrollDir, setScrollDir] = useState(initialScrollDir);

  useEffect(() => {
    let lastScrollY = window.pageYOffset;
    let ticking = false;

    const updateScrollDir = () => {
      const scrollY = window.pageYOffset;

      if (Math.abs(scrollY - lastScrollY) < threshold) {
        ticking = false;
        return;
      }
      setScrollDir(scrollY > lastScrollY ? 'down' : 'up');
      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        // instead of setting a specific number of ms to wait (throttling), 
        // pass it to the browser to be processed on the next frame, whenever that may be.
        window.requestAnimationFrame(updateScrollDir);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return scrollDir;
};
export default useScrollDirection;
