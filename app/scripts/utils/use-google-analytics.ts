import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga';

const gaTrackingCode = process.env.GOOGLE_ANALYTICS_ID;

export function useGoogleAnalytics() {
  const location = useLocation();

  useEffect(() => {
    if (gaTrackingCode) {
      ReactGA.initialize(gaTrackingCode, {
        // debug: process.env.NODE_ENV === 'development'
      });
    }
  }, []);

  useEffect(() => {
    if (gaTrackingCode) {
      const currentPath = location.pathname + location.search;
      ReactGA.pageview(currentPath);
    }
  }, [location]);
}
