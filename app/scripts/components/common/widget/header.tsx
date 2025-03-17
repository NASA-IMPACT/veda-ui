import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { USWDSIcon, USWDSButton } from '$uswds';

/**
 * Renders the header for the fullscreen widget.
 *
 * This header component displays the widget's title and a button to toggle
 * between fullscreen and normal modes. When the widget is in fullscreen mode,
 * the title is displayed as an <h1> element; otherwise, it is displayed as
 * an <h6>.
 *
 * @param {boolean} isExpanded - Indicates whether the widget is currently in
 * fullscreen or full page mode.
 * @param {string} heading - The heading text to be displayed in the header.
 * @param {() => void} handleExpansion - Callback function that toggles the
 * expanded state.
 *
 * @returns {JSX.Element} A JSX element representing the widget header,
 * including the title and a fullscreen toggle button.
 */
const Header = ({
  isExpanded,
  heading,
  handleExpansion
}: {
  isExpanded: boolean;
  heading: string;
  handleExpansion: () => void;
}) => {
  const [showText, setShowText] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateButtonVisibility = useCallback(() => {
    if (containerRef.current) {
      setShowText(containerRef.current.offsetWidth > 450);
    }
  }, []);

  useLayoutEffect(() => {
    updateButtonVisibility(); // ensures that the button text visibility is set correctly when the component first renders.
    window.addEventListener('resize', updateButtonVisibility);
    return () => window.removeEventListener('resize', updateButtonVisibility);
  }, [updateButtonVisibility]);

  return (
    <div
      ref={containerRef}
      className='padding-2 display-flex flex-justify space-between flex-align-center'
    >
      {isExpanded ? <h1>{heading}</h1> : <h6>{heading}</h6>}

      <USWDSButton
        type='button'
        outline={true}
        className='margin-0 margin-left-3'
        onClick={handleExpansion}
      >
        {isExpanded ? <USWDSIcon.Close size={3} /> : <USWDSIcon.ZoomOutMap />}

        {showText && (
          <span>{isExpanded ? 'Exit fullscreen' : 'Enter fullscreen'}</span>
        )}
      </USWDSButton>
    </div>
  );
};

export default Header;
