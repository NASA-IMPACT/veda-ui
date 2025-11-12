import React, { useCallback } from 'react';
import { Icon } from '@trussworks/react-uswds';

import { SelectorButton } from '$components/common/map/style/button';
import useThemedControl from '$components/common/map/controls/hooks/use-themed-control';

export function ShareButtonComponent({
  onClick,
  disabled
}: {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled: boolean;
}) {
  return (
    <SelectorButton
      tipContent='Share Exploration'
      tipProps={{ placement: 'left' }}
      disabled={disabled}
      onClick={onClick}
    >
      <Icon.Share size={3} />
    </SelectorButton>
  );
}

export function ShareButton({
  setLinkCopied
}: {
  setLinkCopied: (copied: boolean) => void;
}) {
  const handleShare = useCallback(async () => {
    try {
      // Get current URL
      const currentUrl = window.location.href;

      // Call the URL shortening API
      const response = await fetch(
        `https://openveda.cloud/service/link/shorten?url=${encodeURIComponent(
          currentUrl
        )}`
      );

      if (!response.ok) {
        throw new Error('Failed to shorten URL');
      }

      const data = await response.json();
      const shortenedUrl = data.short_url;

      // Copy to clipboard
      await navigator.clipboard.writeText(shortenedUrl);
      setLinkCopied(true);
      // TODO: Consider adding a toast notification for success feedback
    } catch {
      // Fallback: copy current URL if shortening fails
      try {
        await navigator.clipboard.writeText(window.location.href);
        setLinkCopied(true);
      } catch {
        // Silent fail - clipboard API may not be available in all contexts
      }
    }
  }, []);

  const control = useThemedControl(
    () => (
      <ShareButtonComponent
        onClick={handleShare}
        disabled={navigator.clipboard ? false : true}
      />
    ),
    {
      position: 'top-right'
    }
  );
  return control;
}
