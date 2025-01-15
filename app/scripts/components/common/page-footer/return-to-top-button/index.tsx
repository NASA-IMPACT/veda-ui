import React, { useEffect, useState } from 'react';
import { USWDSButton } from '$components/common/uswds';

export default function ReturnToTopButton() {
  const [clicked, setClicked] = useState(false);
  //implementing useEffect for nextjs implementation
  useEffect(() => {
    const firstFocusableElement = document.querySelector('button');
    if (firstFocusableElement && clicked) {
      firstFocusableElement.focus();
      setClicked(false);
    }
  }, [clicked]);
  const onClick = () => {
    if (typeof window !== 'undefined') {
      setClicked(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className='margin-left-auto margin-right-auto return-to-top-container'>
      <USWDSButton onClick={onClick} unstyled>
        Return to top
      </USWDSButton>
    </div>
  );
}
