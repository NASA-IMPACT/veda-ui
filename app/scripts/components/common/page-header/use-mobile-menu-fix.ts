import { useEffect } from 'react';

/**
 * Would be better to have this fixed on the react-uswds side!
 *
 * Subscribe to https://github.com/trussworks/react-uswds/issues/2586
 * for updates
 * */

const USWDS_DESKTOP_BREAKPOINT = 1024;
// no magic numbers! Use value from theme?

function useMobileMenuFix(expanded, setExpanded) {
  const handleClickOutside = (event: MouseEvent) => {
    // When the mobile nav is active, clicking outside of the nav should close it
    if (
      event.target instanceof Element &&
      event.target.closest('.usa-overlay')
    ) {
      setExpanded(false);
    }
  };

  const handleResize = () => {
    if (window.innerWidth > USWDS_DESKTOP_BREAKPOINT && expanded) {
      setExpanded(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('resize', handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // We want to register the event listeners only once, when the component mounts
}

export default useMobileMenuFix;
