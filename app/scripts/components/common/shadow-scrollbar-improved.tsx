import React, { useCallback, useEffect, useState } from 'react';
import { ShadowScrollbar } from '@devseed-ui/shadow-scrollbar';

export const ShadowScrollbarImproved = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ShadowScrollbar>
>(function ShadowScrollbarImprovedCmp(props, ref) {
  // eslint-disable-next-line react/prop-types
  const { scrollbarsProps, ...rest } = props;
  const [autoHide, setAutoHide] = useState(true);

  const mouseEnter = useCallback(() => setAutoHide(false), []);

  useEffect(() => {
    setAutoHide(false);
  }, []);

  useEffect(() => {
    if (autoHide) return;

    const timer = setTimeout(() => {
      setAutoHide(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [autoHide]);

  const shadowScrollbarProps = {
    ...(scrollbarsProps ?? {}),
    autoHide
  };

  return (
    <ShadowScrollbar
      ref={ref}
      onMouseEnter={mouseEnter}
      scrollbarsProps={shadowScrollbarProps}
      {...rest}
    />
  );
});
