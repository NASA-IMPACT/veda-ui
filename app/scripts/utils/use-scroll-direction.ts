import { useState, useEffect } from 'react';
const throttle = require('lodash.throttle');

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
        window.requestAnimationFrame(updateScrollDir);
        ticking = true;
      }
    };

    const throttledScroll = throttle(onScroll, 100);

    window.addEventListener('scroll', throttledScroll);

    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, []);

  return scrollDir;
};
export default useScrollDirection;
