import { useEffect } from 'react';
import TagManager from 'react-gtm-module';

const gtMCode = process.env.GOOGLE_TAG_MANAGER_ID;
const gtmAuth = process.env.GOOGLE_TAG_AUTH;
const gtmPreviewEnv = process.env.GOOGLE_TAG_PREVIEW;

// This variables should be saved in env.local or CI
const tagManagerArgs = {
  gtmId: gtMCode,
  auth: gtmAuth,
  preview: gtmPreviewEnv,
  cookies_win:'x'
};

export function useGoogleTagManager() {

  useEffect(() => {
    if (gtMCode) {
      TagManager.initialize(tagManagerArgs);
    }
  }, []);
}