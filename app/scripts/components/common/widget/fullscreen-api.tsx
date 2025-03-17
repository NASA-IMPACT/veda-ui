import React, { ReactNode, useRef, useState } from 'react';
import Header from './header';

/**
 * Renders a widget component with fullscreen capability.
 *
 * This component wraps its children with a container that can be toggled into
 * fullscreen mode.
 * The fullscreen state is controlled via the [Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API), and the component
 * uses a ref to reference its DOM node.
 *
 * @param heading - The title to display in the widget's header.
 * @param children - The content nodes to be rendered inside the widget.
 *
 * @example
 * <FullscreenWidget heading="My Widget">
 *   <p>This is the widget content.</p>
 * </FullscreenWidget>
 */
const FullscreenWidget = ({
  heading,
  children
}: {
  heading: string;
  children: ReactNode;
}) => {
  const widgetRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFullscreen = () => {
    if (widgetRef.current) {
      if (!document.fullscreenElement) {
        widgetRef.current
          .requestFullscreen()
          .then(() => setIsFullscreen(true))
          .catch((err) => {
            // eslint-disable-next-line no-console
            console.error('Error attempting to enable full-screen mode:', err);
          });
      } else if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false));
      }
    }
  };

  return (
    <div // widget-container
      ref={widgetRef}
      className='width-full height-full border border-base-light radius-md'
    >
      <Header
        isExpanded={isFullscreen}
        heading={heading}
        handleExpansion={handleFullscreen}
      />
      <div // widget-content
        className='padding-2'
      >
        {children}
      </div>
    </div>
  );
};

export default FullscreenWidget;
