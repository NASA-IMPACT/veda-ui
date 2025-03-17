import React, { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './header';

interface FullpageModalWidgetProps {
  heading: string;
  children: ReactNode;
}

/**
 * A React component that toggles the display of modal content between a compact
 *  widget view and a full-page overlay.
 *
 * This component renders a container that initially shows a widget with a
 * header and content. When the header's expansion handler is activated, the
 * component transitions to a full-page mode using animated effects provided
 * by Framer Motion's AnimatePresence and motion.div.
 *
 * @param {string} heading - The title text displayed in the header of the
 * modal.
 * @param {React.ReactNode} children - The content to be rendered inside the
 * modal.
 *
 * @example
 * <FullpageModalWidget heading="Modal Title">
 *   <p>Your content goes here.</p>
 * </FullpageModalWidget>
 */
const FullpageModalWidget = ({
  heading,
  children
}: FullpageModalWidgetProps) => {
  const [isFullPage, setIsFullPage] = useState(false);

  return (
    <>
      {!isFullPage && (
        <div // widget-container
          className='width-full height-full border border-base-light radius-md'
        >
          <Header
            isExpanded={isFullPage}
            heading={heading}
            handleExpansion={() => setIsFullPage(true)}
          />
          <div // widget-content
            className='padding-2'
          >
            {children}
          </div>
        </div>
      )}

      <AnimatePresence>
        {isFullPage && (
          <motion.div // fullpage-overlay
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className='position-fixed top-0 left-0 width-full height-full bg-white z-top padding-2 shadow-2'
          >
            <Header
              isExpanded={isFullPage}
              heading={heading}
              handleExpansion={() => setIsFullPage(false)}
            />
            <div // widget-content
              className='padding-2'
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FullpageModalWidget;
