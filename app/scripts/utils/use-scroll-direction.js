import { useState, useEffect } from 'react';
const throttle = require('lodash.throttle');

const useScrollDirection = () => {
  const [scrollDir, setScrollDir] = useState('up');

  useEffect(() => {
    const threshold = 64;
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

    const throttledScroll = throttle(onScroll, 50);

    window.addEventListener('scroll', throttledScroll);

    return () => window.removeEventListener('scroll', throttledScroll);
  }, []);

  return scrollDir;
};
export default useScrollDirection;
