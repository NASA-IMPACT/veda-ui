import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

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
      ReactGA.send('pageview');
    }
  }, [location]);
}
