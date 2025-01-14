import React from 'react';
import { USWDSButton } from '$components/common/uswds';

export default function ReturnToTopButton() {
  return (
    <div
      id='return-to-top-container'
      className='margin-left-auto margin-right-auto'
    >
      <USWDSButton
        onClick={() => {
          if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        unstyled
      >
        Return to top
      </USWDSButton>
    </div>
  );
}
