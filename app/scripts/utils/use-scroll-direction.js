import { useState, useEffect } from 'react';

const useScrollDirection = () => {
  const [scrollDir, setScrollDir] = useState('down');
  const [scrolledAmount, setScrolledAmount] = useState(0);
  const [scrollYBeforeDirChange, setScrollYBeforeDirChange] = useState(
    window.pageYOffset
  );

  useEffect(() => {
    setScrollYBeforeDirChange(window.pageYOffset);
    setScrolledAmount(0);
  }, [scrollDir]);

  useEffect(() => {
    const threshold = 5;
    let lastScrollY = window.pageYOffset;

    let ticking = false;
    const updateScrollDir = () => {
      const scrollY = window.pageYOffset;
      if (Math.abs(scrollY - lastScrollY) < threshold) {
        ticking = false;
        return;
      }

      const newVal = Math.abs(scrollY - scrollYBeforeDirChange);
      setScrolledAmount(newVal);
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

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, [scrollDir, scrolledAmount, scrollYBeforeDirChange]);

  return [scrollDir, scrolledAmount];
};
export default useScrollDirection;
