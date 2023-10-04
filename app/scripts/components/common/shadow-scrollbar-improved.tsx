import React, { useCallback, useEffect, useState } from 'react';
import { ShadowScrollbar } from '@devseed-ui/shadow-scrollbar';

// Moving away from this component because of the issue
// https://github.com/NASA-IMPACT/veda-ui/issues/682#issuecomment-1747334303
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
